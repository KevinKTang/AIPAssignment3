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
        }
        this.eachBlog = this.eachBlog.bind(this);
    }

    // Get blog posts from database on start
    componentDidMount() {
        fetch('/blogs')
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(res => this.setState({blogs: res}))
                }
            })
            .catch(err => console.log('An error occurred: ' + err));
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

    render() {
        return (
            <div className="blog-posts-flex">
                {this.state.blogs.map(blog => this.eachBlog(blog))}
            </div>
        )
    }
}

export default BlogPosts;