import React, { Component } from 'react';
import { VIEWBLOG } from '../constants/ErrorMessages';
import BlogPost from './BlogPost.js';
import Loading from '../Loading.js';
import Welcome from './Welcome.js'
import '../styles/BlogPosts.css';

/*
    The BlogPosts component is simply a container holding the 
    individual BlogPost(s). They are divided into a card view
     sorted by recent while also allowing a user to sort them
     in a number of ways.
*/

class BlogPosts extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: true,
            showLoading: false,
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
    }

    // Loading icon will only show after half a second
    // This avoids it flashing on screen briefly before content loads.
    startLoading() {
        if (this.state.isLoading) {
            this.setState({showLoading: true});
        }
        clearInterval(this.timer);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    // Get blog posts from database on start.
    componentDidMount() {
        this.updateBlogs();
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.blogsView !== this.props.blogsView) || (this.props.refreshView)) {
            this.updateBlogs();
            this.props.updateComplete();
        }
    }

    updateBlogs() {
        this.setState({
            isLoading: true
        });

        if (this.props.isLoggedIn) {
            fetch('/blogsCustom', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    // blogsView is held in the parent (body) state.
                    // This allows a user to go back and return to the previously selected blogsView.
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
                } else {
                    this.setState({
                        isLoading: false
                    });
                    if (res.status === 403) {
                        this.setState({
                            alert: VIEWBLOG.accessDenied
                        });
                    } else {
                        this.setState({
                            alert: VIEWBLOG.genericError
                        })
                    }
                }
            })
            .catch(err => {
                this.setState({
                    alert: 'An error occured: ' + err,
                    isLoading: false
                });
            })
            
        } else {
            // If a guest user or not logged in, retrieve and show the 20 most recent blog posts.
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
                        alert: VIEWBLOG.genericError
                    });
                }
            })
            .catch(err => {
                this.setState({
                    alert: VIEWBLOG.errorOccurred + err
                });
            });
        }
    }

    dismissAlert() {
        this.setState({
            alert: ''
        });
    }

    eachBlog(blog) {
        // If logged in, allow ability to like a blog post and indicate if blog post is already liked
        if (this.props.isLoggedIn) {
            // Check if user has liked the blog post
            let blogLiked;
            if (blog.Likes) {
                blogLiked = blog.Likes.length !== 0;
            } else {
                blogLiked = false;
            }

            return (
                <BlogPost
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    author={blog.User.firstname + ' ' + blog.User.lastname}
                    createdAt={blog.createdAt}
                    description={blog.description}
                    likes={blog.likesCount}
                    comments={blog.commentCount}
                    likeable={true}
                    liked={blogLiked}
                    blogsView={this.props.blogsView}
                    updateBlogsView={this.props.updateBlogsView}>
                </BlogPost>
            );
        } else {
            return (
                <BlogPost
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    author={blog.User.firstname + ' ' + blog.User.lastname}
                    createdAt={blog.createdAt}
                    description={blog.description}
                    likes={blog.likesCount}
                    comments={blog.commentCount}
                    likeable={false}>
                </BlogPost>
            );
        }
    }

    changeBlogDisplay(event) {
        this.props.updateBlogsView(event.target.name);
    }

    // Sorting options of blogs on the main page
    showBlogOptions() {
        return (
            <div className="blog-button-area">
                <button name="recent" className={this.props.blogsView === 'recent' ? ('btn btn-primary blog-button active active border border-dark') : ('btn btn-primary blog-button')} disabled={this.state.isLoading} onClick={this.changeBlogDisplay}>Latest</button>
                <button name="liked" className={this.props.blogsView === 'liked' ? ('btn btn-primary blog-button active active border border-dark') : ('btn btn-primary blog-button')} disabled={this.state.isLoading} onClick={this.changeBlogDisplay}>My Liked</button>
                <button name="mostLiked" className={this.props.blogsView === 'mostLiked' ? ('btn btn-primary blog-button active active border border-dark') : ('btn btn-primary blog-button')} disabled={this.state.isLoading} onClick={this.changeBlogDisplay}>Most Liked</button>
                <button name="random" className={this.props.blogsView === 'random' ? ('btn btn-primary blog-button active active border border-dark') : ('btn btn-primary blog-button tive')} disabled={this.state.isLoading} onClick={this.changeBlogDisplay}>Random</button>
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
        // If logged in, show home text and sorting buttons
        // If not logged in, show welcome jumbotron
        return (
            this.props.isLoggedIn ? (
                <div className="main-title text-center">
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
                <div className="text-center">
                    {this.state.alert ? this.showAlert() : ''}
                    {this.renderTopComponents()}
                    <Loading />
                </div>
            ) : (
                    // If not loading and no blogs were found, indicate this to user
                    !this.state.isLoading && this.state.blogs.length === 0 ? (
                        <div className="text-center">
                            {this.state.alert ? this.showAlert() : ''}
                            {this.renderTopComponents()}
                            <p>There are no blogs to display!</p>
                        </div>
                    // If blogs are found, map and show them
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
