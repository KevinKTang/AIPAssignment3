import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Moment from 'moment';
import '../styles/BlogPost.css';

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
            isDeleting: false,
        }
        this.likeBlog = this.likeBlog.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
        this.viewSelectedBlog = this.viewSelectedBlog.bind(this);
        this.deleteBlog = this.deleteBlog.bind(this);
        this.formatWhenCreated = this.formatWhenCreated.bind(this);
    }

    // To update some props when component mounts before parent async call complete
    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                likes: this.props.likes,
                liked: this.props.liked,
                isDeleting: false
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

    deleteBlog() {
        // Visually indicate deleting to user
        this.setState({
            isDeleting: true
        });
        this.props.deleteBlog(this.props.id);
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
                            // If viewing liked posts, refresh to hide this unliked post
                            if (this.props.blogsView === 'liked') {
                                this.props.updateBlogsView('liked');
                            }
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

    formatWhenCreated() {
        // Show how long since the blog post was created. If over 24 hours, show date.
        let timeSince = Moment.duration(Moment(new Date()).diff(this.props.createdAt));
        let hoursSince = timeSince.asHours();
        // First check in case local system time is slightly ahead of server time
        // This avoids a creation date that is pointing to the future (such as in 1 minute)
        if (hoursSince < 0) {
            return (
                'a few seconds ago'
            )
        } else if (timeSince.asHours() >= 24) {
           return (
               Moment(this.props.createdAt).format('MMM DD, YYYY')
           )
       } else {
            return (
                Moment(this.props.createdAt).fromNow()
            )
        }
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
                <div className="card shadow text-center">
                    <div className="card-body">
                        <h3 className="card-title">{this.props.title}</h3>

                        {/* Show author if not viewing your own blogs */}
                        {this.props.canDelete ? '' : (<h5 className="card-author">{this.props.author}</h5>)}

                        {this.formatWhenCreated()}
                            
                        <hr></hr>
                        
                        <div className="card-description">{this.props.description}</div>
                        <hr></hr>
                        
                        {/* Likes. If no likes, show 0 */}
                        <p>Likes: {this.state.likes ? this.state.likes : 0}</p>
                        {/* Comments. If no comments, show 0 */}
                        <p>Comments: {this.props.comments ? this.props.comments : 0}</p>

                        {/* If being viewed as my blogs, show delete option and number of likes 
                        () => this.props.deleteBlog(this.props.id)*/}
                        {this.props.canDelete ? (
                            <button disabled={this.state.isDeleting} className="btn btn-danger" onClick={() => {if (window.confirm('Are you sure you wish to delete this blog post?')) this.deleteBlog()}}>{this.state.isDeleting ? ('Deleting...') : ('Delete')}</button>
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
