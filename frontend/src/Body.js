import React, { Component } from 'react';
import './styles/Body.css';
import BlogPosts from './body-components/BlogPosts.js';
import CreatePost from './body-components/CreatePost.js';

/* 
    The body component is responsible for displaying all the content of
    our website, it starts off displaying the cardview of recently added
    or most popular blogs and will change to display a user's blogs when
    interacting with the 'Your Posts' navigation link in the header.
*/


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
                <button onClick={this.togglecreatePost}>Create Blog Post</button>
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
            <div>
            {this.state.createPost ? this.showCreatePost() : this.showBlogPosts()}
            </div>
        )
    }
}

export default Body;