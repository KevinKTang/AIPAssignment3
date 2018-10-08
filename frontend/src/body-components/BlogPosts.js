import React, { Component } from 'react';
import BlogPost from './BlogPost.js';
import Loading from '../Loading.js';
import Welcome from './Welcome.js'
import '../styles/BlogPosts.css';

/*
    BlogPosts component is simply a container holding
    the individual BlogPost(s) and divides them up into a card view
    for the main page of our website.
*/

class BlogPosts extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: true,
            showLoading: '',
            blogs: [],
            alert: ''
        }
        this.eachBlog = this.eachBlog.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.timer = setInterval(this.startLoading, 500);
        this.showBlogOptions = this.showBlogOptions.bind(this);
        this.changeBlogDisplay = this.changeBlogDisplay.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.renderTopComponents = this.renderTopComponents.bind(this);
        this.updateButtons = this.updateButtons.bind(this);
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

    // Get blog posts from database on start
    componentDidMount() {
        this.updateBlogs();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.blogsView !== this.props.blogsView) {
            this.updateBlogs();
        }
    }

    updateButtons() {
        // Visually indicate selected blogsView on the button
        let buttonElements = document.getElementsByClassName('blog-button');
        for (var i = 0; i < buttonElements.length; i++) {
            if (buttonElements.item(i).name === this.props.blogsView) {
                buttonElements.item(i).classList.add('active', 'border', 'border-dark');
            } else {
                buttonElements.item(i).classList.remove('active', 'border', 'border-dark');
            }
        }
    }

    updateBlogs() {
        if (this.props.isLoggedIn) {
            this.updateButtons();
            fetch('/blogsCustom', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    // blogsView is held in the parent (body) state.
                    // This allows a user to go back and return to the selected blogsView
                    display: this.props.blogsView
                })
            })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(res => this.setState({
                            blogs: res,
                            isLoading: false,
                            showLoading: false
                        }));
                } else if (res.status === 403) {
                    this.setState({
                        alert: 'An error occurred. You must be logged in to use this feature.'
                    });
                } else {
                    this.setState({
                        alert: 'Error retrieving blog posts.'
                    })
                }
            })
            .catch(err => {
                this.setState({
                    alert: 'An error occured: ' + err
                });
            })
            
        } else {
            // If not logged in, get the 20 most recent blog posts
            fetch('/blogs')
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(res => this.setState({
                            blogs: res,
                            isLoading: false,
                            showLoading: false
                        }));
                }
                else {
                    this.setState({
                        alert: 'Error retrieving blog posts.'
                    });
                }
            })
            .catch(err => {
                this.setState({
                    alert: 'An error occured: ' + err
                });
            });
        }
    }

    dismissAlert() {
        this.setState({
            alert: ''
        });
    }

    // Function to loop through and render the blogs
    eachBlog(blog) {
        // If logged in, allow ability to like a blog post and indicate if blog post is already liked
        if (this.props.isLoggedIn) {
            // Check if this user has liked the blog post
            let blogLiked;
            if (blog.likes) {
                blogLiked = blog.likes.length !== 0;
            } else {
                blogLiked = false;
            }
            return (
                <BlogPost
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    description={blog.description}
                    likes={blog.likesCount}
                    likeable={true}
                    liked={blogLiked}
                    author={blog.user.firstname + ' ' + blog.user.lastname}>
                </BlogPost>
            );
        } else {
            return (
                <BlogPost
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    description={blog.description}
                    likes={blog.likesCount}
                    likeable={false}
                    author={blog.user.firstname + ' ' + blog.user.lastname}>
                </BlogPost>
            );
        }
    }

    changeBlogDisplay(event) {
        this.props.updateBlogsView(event.target.name);
    }

    showBlogOptions() {
        return (
            <div className="blog-button-area">
                <button name="recent" className="btn btn-primary blog-button active" disabled={this.state.isLoading} onClick={this.changeBlogDisplay}>Latest</button>
                <button name="liked" className="btn btn-primary blog-button" disabled={this.state.isLoading} onClick={this.changeBlogDisplay}>My Liked</button>
                <button name="mostLiked" className="btn btn-primary blog-button" disabled={this.state.isLoading} onClick={this.changeBlogDisplay}>Most Liked</button>
                <button name="random" className="btn btn-primary blog-button" disabled={this.state.isLoading} onClick={this.changeBlogDisplay}>Random</button>
            </div>
        )
    }

    showAlert() {
        return (
            <div className="alert alert-danger alert-dismissible">
                {this.state.alert}
                <button type="button" onClick={this.dismissAlert} className="close">&times;</button>
            </div>
        )
    }

    renderTopComponents() {
        // If logged in show home text and sorting buttons
        // If not logged in, show welcome jumbotron
        return (
            this.props.isLoggedIn ? (
                <div>
                    <h1>Home</h1>
                    {this.showBlogOptions()}
                </div>
            ) : <Welcome />
        )
    }

    render() {
        return (
            // If loading
            this.state.showLoading ? (
                <div>
                    {this.state.alert ? this.showAlert() : ''}
                    {this.renderTopComponents()}
                    <Loading />
                </div>
            ) : (
                    // If not loading and no blogs were found
                    !this.state.isLoading && this.state.blogs.length === 0 ? (
                        <div>
                            {this.state.alert ? this.showAlert() : ''}
                            {this.renderTopComponents()}
                            <p>There are no blogs to display!</p>
                        </div>
                    ) : (
                            <div>
                                {this.state.alert ? this.showAlert() : ''}
                                {this.renderTopComponents()}
                                <div className="blog-posts-flex">
                                    {this.state.blogs.map(blog => this.eachBlog(blog))}
                                </div>
                            </div>
                        )
                )
        )
    }

}

export default BlogPosts;
