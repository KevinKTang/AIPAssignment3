import React, { Component } from 'react';
import '../styles/BlogPosts.css';
import BlogPost from './BlogPost.js';

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