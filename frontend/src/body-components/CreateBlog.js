import React, { Component } from 'react';
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
            content: ''
        }
        this.newPost = this.newPost.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    
    newPost(event) {
        event.preventDefault();
        fetch('/createBlog', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: this.state.title,
                content: this.state.content
            })
        }).then(res => {
            if (res.status === 201) {
                res.json().then(document.getElementById('createBlogForm').submit()); // Handle manually
            } else if (res.status === 403) {
                console.log('Error creating new blog post. Access denied')
            } else {
                console.log('Error creating new blog post');
            }
        })
        .catch(err => console.error('An error occurred: ' + err));
    }
    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        });
    }

    render() {
        if (this.props.show) {
            return (
                <div>
                    <h1>New Blog Post</h1>
                    <form id="createBlogForm" onSubmit={this.newPost}>
                        <input className="create-post-input" name="title" value={this.state.title} onChange={this.handleInputChange} type="text" placeholder="Title" required></input>
                        <textarea rows="10" cols="50" name="content" value={this.state.content} onChange={this.handleInputChange} className="create-post-input" placeholder="Blog post content" required></textarea>
                        <button className="create-post-input">Post</button>
                    </form>
                </div>
            )
        } else {
            return null;
        }
    }
}

export default CreatePost;