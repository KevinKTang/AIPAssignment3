import React, { Component } from 'react';
import './styles/CreatePost.css';

/* 
    The CreatePost component is available through the 'Your Posts' view, 
    it will consist of input fields for Title, and for content, a rich
    text editor will be provided through an framework such as Draft.js, Slate.js.
*/

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