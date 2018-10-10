import React, { Component } from 'react';
import BlogPost from './BlogPost';
import Loading from '../Loading.js';
import '../styles/MyBlogs.css';

/* 
    This component contains a view with all the blogs
    the logged in user has created, allowing for deletion and viewing.
*/

class MyBlogs extends Component {
    constructor(props) {
        super();
        this.state = {
            isLoading: true,
            showLoading: '',
            blogs: [],
            alert: ''
        }
        this.eachBlog = this.eachBlog.bind(this);
        this.deleteBlog = this.deleteBlog.bind(this);
        this.deleteBlogState = this.deleteBlogState.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
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
            } else if (res.status === 403) {
                this.setState({
                    alert: "Access denied. Make sure you're logged in before viewing your blog posts.",
                    isLoading: false,
                    showLoading: false
                });
            }
        })
        .catch(err => {
            console.error('An error occurred: ' + err);
            this.setState({
                alert: "An error occurred.",
                isLoading: false,
                showLoading: false
            });
        });
    }

    dismissAlert() {
        this.setState({
            alert: ''
        });
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
                this.setState({
                    alert: 'Access denied to delete this blog.'
                });
            } else {
                this.setState({
                    alert: 'Error deleting blog.'
                });
            }
        })
        .catch(err => {
            console.log('An error occurred. ' + err);
            this.setState({
                alert: 'An error occurred.'
            });
        });
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
                description={blog.description}
                likes={blog.likesCount}
                comments={blog.commentCount}
                canDelete={true}
                deleteBlog={this.deleteBlog}>
            </BlogPost>
        );
    }

    render() {
        return (
            <div className="text-center">
                {/* Alert for incorrect register */}
                {this.state.alert ? (
                    <div className="alert alert-danger alert-dismissible">
                        {this.state.alert}
                        <button type="button" onClick={this.dismissAlert} className="close">&times;</button>
                    </div>
                ) : ('')}

                {this.state.showLoading ? (
                    <div>
                        <h1>My Blogs</h1>
                        <Loading />
                    </div>
                ) : (
                        <div className="text-center">
                            <h1>My Blogs</h1>
                            {this.state.blogs.length === 0 && this.state.isLoading === false && this.props.isLoggedIn ? (
                                <p>You haven't created any blogs yet!</p>
                            ) : (
                                    <div className="blog-posts-flex">
                                        {this.state.blogs.map(blog => this.eachBlog(blog))}
                                    </div>
                                )}
                        </div>
                    )}
            </div>
        )
    }

}

export default MyBlogs;
