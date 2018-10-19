import React, { Component } from 'react';
import MyEditor from './MyEditor.js';
import { EditorState, convertToRaw } from 'draft-js';
import { CREATE_BLOG } from '../constants/ErrorMessages.js'
import '../styles/CreateBlog.css';

/*
    The CreateBlog component contains the form to create a blog,
    allowing for users to input a title, a description and blog content
    utilising DraftJS to provide rich text editing (i.e. Bold, Italic, Headings).
*/

class CreatePost extends Component {
    constructor(props) {
        super();
        this.state = {
            isLoading: false,
            title: '',
            description: '',
            editorState: EditorState.createEmpty(),
            alert: ''
        }
        this.newBlog = this.newBlog.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);
    }

    componentDidMount() {
        // Focus on first form input box (i.e. Title)
        this._input.focus();
    }

    newBlog(event) {
        event.preventDefault();
        if (convertToRaw(this.state.editorState.getCurrentContent()).blocks[0].text !== '') {
            // Visually indicate loading on submit button to user (Submit button is grayed out and text changes to "Submitting...")
            this.setState({
                isLoading: true
            });

            fetch('/createBlog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: this.state.title,
                    description: this.state.description,
                    content: convertToRaw(this.state.editorState.getCurrentContent())
                })
            }).then(res => {

                // Restore button to normal state (not loading)
                this.setState({
                    isLoading: false
                });

                if (res.status === 201) {
                    this.setState({
                        title: '',
                        description: '',
                        editorState: ''
                    });
                    this.props.history.push("/myBlogs");
                } else if (res.status === 403) {
                    this.setState({
                        alert: CREATE_BLOG.accessDenied
                    });
                } else if (res.status === 400) {
                    res.json().then(res => {
                        this.setState({
                            alert: res.alert
                        });
                    });
                } else {
                    this.setState({
                        alert: CREATE_BLOG.genericError
                    });
                }
            })
            .catch(err => {
                console.error(CREATE_BLOG.errorOccurred + err);
                // Restore button to normal state (not loading)
                this.setState({
                    isLoading: false
                });
            });
        } else {
            this.setState({ alert: CREATE_BLOG.noBlogContent })
        }
    }

    dismissAlert() {
        this.setState({
            alert: ''
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value,
            // Hide alert when user changes input
            alert: ''
        });
    }

    onEditorChange(editorState) {
        this.setState({
            editorState: editorState
        });
    }

    render() {
        return (
            <div>
                <h1 className="title">Create Blog</h1>
                {/* Create blog form */}
                <form onSubmit={this.newBlog}>
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <input ref={c => this._input = c} className="form-control" name="title" value={this.state.title} onChange={this.handleInputChange} type="text" placeholder="Title" required></input>
                        <textarea className="form-control" name="description" value={this.state.description} onChange={this.handleInputChange} type="text" placeholder="Description" required></textarea>
                    </div>
                    <MyEditor updateParent={this.onEditorChange} />
                    <div className="text-center">
                        {this.state.alert ? (
                            <div className="alert alert-danger alert-dismissible">
                                {this.state.alert}
                                <button type="button" onClick={this.dismissAlert} className="close">&times;</button>
                            </div>
                        ) : ('')}
                    </div>
                    <div className="text-center">
                        <button disabled={this.state.isLoading} className="btn btn-primary">{this.state.isLoading ? ('Posting...') : ('Post')}</button>
                    </div>
                </form>
            </div>
        )

    }

}

export default CreatePost;
