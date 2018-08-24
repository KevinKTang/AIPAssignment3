import React, { Component } from 'react';
import './styles/CreatePost.css';

class CreatePost extends Component {
    render() {
        return (
            <div>
                <p>New Blog Post</p>
                <form>
                    <input className="createpostinput" placeholder="title"></input>
                    <input className="createpostinput" placeholder="blog post content"></input>
                    <button className="createpostinput">Post</button>
                </form>
            </div>
        )
    }
}

export default CreatePost;