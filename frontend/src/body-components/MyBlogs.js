import React, { Component } from 'react';
import '../styles/MyBlogs.css';
import BlogPost from './BlogPost';

class MyBlogs extends Component {
    constructor(props) {
        super();
        this.state = {
            blogs: []
        }
        this.eachBlog = this.eachBlog.bind(this);
        this.updateBlogs = this.updateBlogs.bind(this);
        this.deleteBlog = this.deleteBlog.bind(this);
        this.deleteBlogState = this.deleteBlogState.bind(this);
    }
    
    componentDidMount() {
        fetch('/myblogs')
        .then(res => {
            if (res.status === 200) {
                res.json()
                    .then (res => this.setState({blogs: res}))
            }
        })
        .catch(err => console.error('An error occurred: ' + err));
    }

    updateBlogs() {
        fetch('/myblogs')
        .then(res => {
            if (res.status === 200) {
                res.json()
                    .then (res => this.setState({blogs: res}))
            }
        })
        .catch(err => console.error('An error occurred: ' + err));
    }

    // If there is a new blog to add, add it to the state
    // If there is a change in session, clear and reload the state
    componentDidUpdate(prevProps) {
        if ((this.props.blogToAdd !== prevProps.blogToAdd) && this.props.blogToAdd !== '') {
            this.setState({
                blogs: [
                    ...this.state.blogs,
                    this.props.blogToAdd
                ]
            });
        }
        // If a user has logged in populate the blogs
        // If a user has logged out, clear the blogs
        if (this.props.isLoggedIn !== prevProps.isLoggedIn) {
            if (this.props.isLoggedIn) {
                this.updateBlogs();
            } else {
                this.setState({blogs: []});
            }
        }
    }

    deleteBlog(id) {
        fetch('/deleteBlog', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                blogId: id
            })
        }).then(res => {
            if (res.status === 200) {
                this.deleteBlogState(id);
                this.props.removeBlog(id);
            } else if (res.status === 403) {
                console.log('Access denied to delete this blog');
            } else {console.log('Error deleting blog');}
        })
        .catch();
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
                content={blog.content}
                canDelete={true}
                deleteBlog={this.deleteBlog}>
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

export default MyBlogs;