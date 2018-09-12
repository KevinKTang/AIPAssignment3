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
        this.deleteBlogState = this.deleteBlogState.bind(this);
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
            this.updateBlogs();
        }
        // If there is a blog to delete, delete it
        if (this.props.blogIdToDelete !== prevProps.blogIdToDelete) {
            this.deleteBlogState(this.props.blogIdToDelete);
        }
    }

    // Deletes the selected blog from the state
    deleteBlogState(blogId) {
        this.setState({
            blogs: this.state.blogs.filter(blog => blog.id !== blogId)
        });
    }

    // Create blog post from data from database
    eachBlog(blog) {
        return(
            <BlogPost
                key={blog.id}
                id={blog.id}
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