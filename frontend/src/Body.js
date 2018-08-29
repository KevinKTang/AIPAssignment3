import React, { Component } from 'react';
import './styles/Body.css';
import BlogPosts from './BlogPosts.js';
import CreatePost from './CreatePost.js';

class Body extends Component {

    constructor() {
        super();
        this.state = {
            createPost: false
        }
        this.togglecreatePost = this.togglecreatePost.bind(this);
    }

    togglecreatePost() {
        this.setState(prevState => ({
            createPost: !prevState.createPost,
        }))
    }

    showBlogPosts() {
        return (
            <div className="app-body">
                <BlogPosts />
                <button onClick={this.togglecreatePost}>Create a new Blog Post</button>
            </div>
        )
    }

    showCreatePost() {
        return (
            <div className="app-body">
                <CreatePost />
                <br></br>
                <br></br>
                <button onClick={this.togglecreatePost}>View Blog Posts</button>
            </div>
        )
    }

    render() {
        return(
            this.state.createPost ? this.showCreatePost() : this.showBlogPosts()
        )
    }
}

export default Body;