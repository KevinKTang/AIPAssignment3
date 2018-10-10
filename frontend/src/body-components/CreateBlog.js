import React, { Component } from 'react';
import MyEditor from './MyEditor.js';
import { EditorState, convertToRaw } from 'draft-js';
import '../styles/CreateBlog.css';

/*
    This component contains the form used to create
    a blog post
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
        // Focus on first form input box
        this._input.focus();
    }

    newBlog(event) {
        event.preventDefault();
        if (convertToRaw(this.state.editorState.getCurrentContent()).blocks[0].text !== '') {
            
            // Visually indicate loading on submit button to user
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
                        alert: "Access denied. Make sure you're logged in before creating a blog post."
                    });
                } else if (res.status === 400) {
                    res.json().then(res => {
                        this.setState({
                            alert: res.alert
                        });
                    });
                } else {
                    this.setState({
                        alert: 'Error creating new blog post.'
                    });
                }
            })
            .catch(err => {
                console.error('An error occurred: ' + err);
                // Restore button to normal state (not loading)
                this.setState({
                    isLoading: false
                });
            });
        } else {
            this.setState({ alert: 'There is no content in your blog!' })
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
                <h1 className="create-blog-title">Create Blog</h1>
                {/* Blog post form */}
                <form onSubmit={this.newBlog}>
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <input ref={c => this._input = c} className="form-control" name="title" value={this.state.title} onChange={this.handleInputChange} type="text" placeholder="Title" required></input>
                        <input className="form-control" name="description" value={this.state.description} onChange={this.handleInputChange} type="text" placeholder="Description" required></input>
                    </div>
                    <MyEditor updateParent={this.onEditorChange} />
                    {/* TODO: fix rendering position */}
                    {/* Alert for incorrect blog post */}
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
