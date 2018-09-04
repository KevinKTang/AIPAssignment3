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
        this.testPost = this.testPost.bind(this);
    }

    // Get blog posts from database on start
    componentWillMount() {
        fetch('http://localhost:5000/blogs')
            .then(res => res.json())
            .then(data => this.setState({blogs: data}));
    }

    // Create blog post from data from database
    eachBlog(blog) {
        return(
            <BlogPost
                key={blog.id}
                title={blog.title}
                content={blog.content}>
            </BlogPost>
        )
    }

    testPost() {
        fetch('http://localhost:5000/createBlog', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: 'This is a title',
                content: 'This is a body of a blog post'
            })
        }).then(res => res.json())
            .then(data => {
                this.setState({
                    blogs: [
                        ...this.state.blogs,
                        data
                    ]
                });
            })
    }

    // Function to update blogs after we add one
    updateBlogs() {
        fetch('http://localhost:5000/blogs')
            .then(res => res.json())
            .then(data => this.setState({ blogs: data }));
    }

    render() {
        return (
            <div className="blog-posts-flex">
                {this.state.blogs.map(blog => this.eachBlog(blog))}
                <button onClick={() => this.testPost()}>Test Add Post</button>
            </div>
        )
    }
}

export default BlogPosts;