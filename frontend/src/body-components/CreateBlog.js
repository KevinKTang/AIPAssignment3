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
            title: '',
            blurb: '',
            editorState: EditorState.createEmpty(),
            alert: ''
        }
        this.newBlog = this.newBlog.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);
    }
    
    newBlog(event) {
        event.preventDefault();
        if (convertToRaw(this.state.editorState.getCurrentContent()).blocks[0].text !== '') {
            fetch('/createBlog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: this.state.title,
                    blurb: this.state.blurb,
                    content: convertToRaw(this.state.editorState.getCurrentContent())
                })
            }).then(res => {
                if (res.status === 201) {
                    this.setState({
                        title: '',
                        blurb: '',
                        editorState: ''
                    });
                    this.props.history.push("/myBlogs");
                } else if (res.status === 403) {
                    this.setState({
                        alert: "Access denied. Make sure you're logged in before creating a blog post."
                    });
                } else {
                    this.setState({
                        alert: 'Error creating new blog post.'
                    });
                }
            })
                .catch(err => console.error('An error occurred: ' + err));
        } else {
            this.setState({alert: 'There is no content in your blog!'})
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
                <h1>Create Blog</h1>
                {/* Blog post form */}
                <form onSubmit={this.newBlog}>
                    <input className="create-post-input" name="title" value={this.state.title} onChange={this.handleInputChange} type="text" placeholder="Title" required></input>
                    <input className="create-blurb-input" name="blurb" value={this.state.blurb} onChange={this.handleInputChange} type="text" placeholder="Blurb" required></input>
                    <MyEditor updateParent={this.onEditorChange} />

                    {/* TODO: fix rendering position */}
                    {/* Alert for incorrect blog post */}
                    {this.state.alert ? (
                        <div className="alert alert-danger alert-dismissible">
                            {this.state.alert}
                            <button type="button" onClick={this.dismissAlert} className="close">&times;</button>
                        </div>
                    ) : ('')}
                
                    <button className="btn btn-primary">Post</button>
                </form>
            </div>
        )

    }

}

export default CreatePost;
