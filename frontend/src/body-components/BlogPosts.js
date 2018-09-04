import React, { Component } from 'react';
import '../styles/BlogPosts.css';
import BlogPost from './BlogPost.js';

/*
    BlogPosts component is simply a container holding
    the individual BlogPost(s) and divides them up into a card view
    for the main page of our website.
*/

class BlogPosts extends Component {

    constructor() {
        super();
        this.state = {
            blogs: []
        };
        this.eachBlog = this.eachBlog.bind(this);
    }

    // Get blog posts from database
    componentWillMount() {
        fetch('http://localhost:3000/blogs')
            .then(res => res.json())
            .then(data => this.setState({blogs: data}));
    }

    // Create blog post from data from database
    eachBlog(blog, i) {
        return(
            <BlogPost
                key={blog.id}
                title={blog.title}
                body={blog.body}>
            </BlogPost>
        )
    }

    render() {
        return (
            <div className="blog-posts-flex">
                {this.state.blogs.map(this.eachBlog)}
            </div>
        )
    }
}

export default BlogPosts;