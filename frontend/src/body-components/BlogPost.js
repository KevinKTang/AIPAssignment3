import React, { Component } from 'react';
import '../styles/BlogPost.css';
import { withRouter } from 'react-router';

/* 
    Blog Post cards will be displayed on the main page.
    They will display a title, image where it is available
    and short description of the blog content.
*/

class BlogPost extends Component {

    constructor(props) {
        super();
        this.state = {
            likes: '',
            alert: '',
            liked: '',
        }
        this.likeBlog = this.likeBlog.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
        this.viewSelectedBlog = this.viewSelectedBlog.bind(this);
    }

    // To update some props when component mounts before parent async call complete
    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                likes: this.props.likes,
                liked: this.props.liked
            });
        }
    }

    componentDidMount() {
        this.setState({
            likes: this.props.likes,
            liked: this.props.liked
        });
    }

    dismissAlert() {
        this.setState({
            alert: ''
        });
    }

    likeBlog() {
        fetch('/likeBlog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                blogId: this.props.id
            })
        }).then((res) => {
            if (res.status === 200) {
                res.json()
                    .then(res => {
                        if (res.liked) {
                            // Blog post has been liked
                            this.setState({
                                likes: this.state.likes + 1,
                                alert: '',
                                liked: true
                            });
                        } else if (!res.liked) {
                            // Blog post has been unliked
                            this.setState({
                                likes: this.state.likes - 1,
                                alert: '',
                                liked: false
                            });
                        }
                    })
            } else if (res.status === 404) {
                this.setState({
                    alert: 'Error. Blog post not found.'
                });
            } else if (res.status === 403) {
                this.setState({
                    alert: 'Error. You must be logged in to like blog posts.'
                });
            } else {
                this.setState({
                    alert: 'Error liking blog post.'
                });
            }
        });
    }

    viewSelectedBlog() {
        this.props.history.push({
            pathname: '/ViewBlogPost/' + this.props.id
        });
    }

    // Blog posts that are displayed in the user's blog section can be deleted
    render() {
        return (
            <div>
                {/* Alert for error liking post */}
                {this.state.alert ? (
                    <div className="alert alert-danger alert-dismissible">
                        {this.state.alert}
                        <button type="button" onClick={this.dismissAlert} className="close">&times;</button>
                    </div>
                ) : ('')}

                {/* Blog post */}
                <div className="card shadow">
                    <div className="card-body">
                        <h5 className="card-title">{this.props.title}</h5>

                        {/* Show author if not viewing your own blogs */}
                        {this.props.canDelete ? '' : (<p>By: {this.props.author}</p>)}
                        <hr></hr>
                        
                        <div className="card-text">{this.props.description}</div>
                        <hr></hr>
                        {/* If no likes, show 0 */}
                        <p>Likes: {this.state.likes ? this.state.likes : 0}</p>

                        {/* If being viewed as my blogs, show delete option and number of likes 
                        () => this.props.deleteBlog(this.props.id)*/}
                        {this.props.canDelete ? (
                            <button className="btn btn-danger" onClick={() => {if (window.confirm('Are you sure you wish to delete this blog post?')) this.props.deleteBlog(this.props.id)}}>Delete</button>
                        ) : ('')}

                        {/* If being viewed while logged in, show number of likes and option to like */}
                        {this.props.likeable ? (
                            this.state.liked ? (
                                <button className="btn btn-primary" onClick={this.likeBlog}>Unlike</button>
                            ) : (
                                <button className="btn btn-primary" onClick={this.likeBlog}>Like</button>
                            )
                        ) : ('')}
                        <button className="btn btn-success view-button" onClick={this.viewSelectedBlog}>View</button>
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(BlogPost);
