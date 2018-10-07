import React, { Component } from 'react';
import BlogPost from './BlogPost';
import Loading from '../Loading.js';
import '../styles/MyBlogs.css';

class MyBlogs extends Component {
    constructor(props) {
        super();
        this.state = {
            isLoading: true,
            showLoading: '',
            blogs: []
        }
        this.eachBlog = this.eachBlog.bind(this);
        this.deleteBlog = this.deleteBlog.bind(this);
        this.deleteBlogState = this.deleteBlogState.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.timer = setInterval(this.startLoading, 500);
    }

    // Loading icon will only show after half a second
    // This avoids it flashing on screen briefly before content loads
    startLoading() {
        if (this.state.isLoading) {
            this.setState({showLoading: true});
        }
        clearInterval(this.timer);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    
    componentDidMount() {
        this.setState({isLoading: true});
        this.timer = setInterval(this.startLoading, 500);
        fetch('/myBlogs')
        .then(res => {
            if (res.status === 200) {
                res.json()
                    .then (res => this.setState({
                        blogs: res,
                        isLoading: false,
                        showLoading: false
                    }));
            }
        })
        .catch(err => console.error('An error occurred: ' + err));
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

    // Function to loop through and render the blogs
    eachBlog(blog) {
        return(
            <BlogPost
                key={blog.id}
                id={blog.id}
                title={blog.title}
                blurb={blog.blurb}
                likes={blog.likesCount}
                canDelete={true}
                deleteBlog={this.deleteBlog}>
            </BlogPost>
        );
    }

    render() {
        return (
            this.state.showLoading ? (
                <div>
                    <h1>My Blogs</h1>
                    <Loading />
                </div>
            ) : (
                    <div>
                    <h1>My Blogs</h1>
                    {this.state.blogs.length === 0 && this.state.isLoading === false ? (
                        <p>You haven't created any blogs yet!</p>
                    ) : (
                            <div className="blog-posts-flex">
                                {this.state.blogs.map(blog => this.eachBlog(blog))}
                            </div>
                        )}
                    </div>
                )
        )
    }

}

export default MyBlogs;
