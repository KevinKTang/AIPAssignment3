import React, { Component } from 'react';
import '../styles/CreatePost.css';

/*
    This component contains the form used to create
    a blog post
*/

class CreatePost extends Component {
    constructor() {
        super();
        this.newPost = this.newPost.bind(this);
    }

    newPost(event) {
        event.preventDefault();
        fetch('http://localhost:5000/createBlog', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: this._inputTitle.value,
                content: this._inputContent.value
            })
        }).then(document.getElementById('createBlogForm').submit());
    }

    render() {
        return (
            <div>
                <p>New Blog Post</p>
                <form id="createBlogForm" onSubmit={this.newPost}>
                    <input className="create-post-input" type="text" ref={input => this._inputTitle = input} placeholder="Title" required></input>
                    <textarea rows="10" cols="50" className="create-post-input" ref={input => this._inputContent = input} placeholder="Blog post content" required></textarea>
                    <button className="create-post-input">Post</button>
                </form>
            </div>
        )
    }
}

export default CreatePost;