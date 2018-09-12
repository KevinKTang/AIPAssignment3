import React, { Component } from 'react';
import '../styles/BlogPosts.css';
import BlogPost from './BlogPost.js';

/*
    BlogPosts component is simply a container holding
    the individual BlogPost(s) and divides them up into a card view
    for the main page of our website.
*/

class BlogPosts extends Component {

    constructor(props) {
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
            .catch(err => console.error('An error occurred: ' + err));
    }

    updateBlogs() {
        console.log('updating blogs...')
        fetch('/blogs')
        .then(res => {
            if (res.status === 200) {
                res.json()
                    .then (res => this.setState({blogs: res}))
            }
        })
        .catch(err => console.error('An error occurred: ' + err));
    }

    // If there is a new blog to add, add it to the state
    componentDidUpdate(prevProps) {
        if ((this.props.blogToAdd !== prevProps.blogToAdd) && this.props.blogToAdd !== '') {
            this.setState({
                blogs: [
                    ...this.state.blogs,
                    this.props.blogToAdd
                ]
            });
        }
        // If a user has logged in or out, populate the blogs
        if (this.props.isLoggedIn !== prevProps.isLoggedIn) {
            console.log('login change for main page')
            this.updateBlogs();
        }
    }

    // Create blog post from data from database
    eachBlog(blog) {
        return(
            <BlogPost
                key={blog.id}
                title={blog.title}
                content={blog.content}>
            </BlogPost>
        );
    }

    render() {
        if (this.props.show) {
            return (
                <div className="blog-posts-flex">
                    {this.state.blogs.map(blog => this.eachBlog(blog))}
                </div>
            )
        } else {
            return null;
        }
    }
}

export default BlogPosts;