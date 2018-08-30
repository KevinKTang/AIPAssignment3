import React, { Component } from 'react';
import './styles/BlogPosts.css';
import BlogPost from './BlogPost.js';

/*
    BlogPosts component is simply a container holding
    the individual BlogPost(s) and divides them up into a card view
    for the main page of our website.
*/

class BlogPosts extends Component {
    render() {
        return (
            <div className="blog-posts-flex">
                <BlogPost />
                <BlogPost />
                <BlogPost />
            </div>
        )
    }
}

export default BlogPosts;