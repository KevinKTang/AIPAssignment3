import React, { Component } from 'react';
import './styles/CreatePost.css';

class CreatePost extends Component {
    render() {
        return (
            <div>
                <p>New Blog Post</p>
                <form>
                    <input className="create-post-input" placeholder="title"></input>
                    <input className="create-post-input" placeholder="blog post content"></input>
                    <button className="create-post-input">Post</button>
                </form>
            </div>
        )
    }
}

export default CreatePost;