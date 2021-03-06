import React, { Component } from 'react';
import { EditorState, convertFromRaw, Editor } from 'draft-js';
import { COMMENT, LIKE, VIEWBLOG } from '../constants/ErrorMessages';
import Moment from 'moment';
import Loading from '../Loading'
import '../styles/ViewBlogPost.css'

/* 
    The ViewBlogPost component is used to display a blog post in its
    entirety when a user selects a blog post. It also displays associated
    likes and comments at the bottom of the blog post.

*/

class ViewBlogPost extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: true,
            showLoading: false,
            isLoadingComment: false,
            alert: '',
            blogId: '',
            title: '',
            createdAt: '',
            description: '',
            commentCount: '',
            comments: [],
            // Initialise empty editorState so we can add content later
            editorState: EditorState.createEmpty(),
            author: '',
            likes: '',
            liked: '',
            inputComment: ''
        }
        this.startLoading = this.startLoading.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
        this.eachComment = this.eachComment.bind(this);
        this.comment = this.comment.bind(this);
        this.likeBlog = this.likeBlog.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.formatWhenCreated = this.formatWhenCreated.bind(this);
        this.timer = setInterval(this.startLoading, 500);
    }

    // Loading icon will only show after half a second
    // This avoids it flashing on screen briefly before content loads
    startLoading() {
        if (this.state.isLoading) {
            this.setState({ showLoading: true });
        }
        clearInterval(this.timer);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    componentDidMount() {
        let path = this.props.location.pathname;
        let slashIndex = this.props.location.pathname.lastIndexOf('/');
        let blogId = this.props.location.pathname.substr(slashIndex + 1, path.length);
        fetch('/blog/' + blogId)
            .then(res => {
                this.setState({
                    isLoading: false,
                    showLoading: false
                });
                if (res.status === 200) {
                    res.json()
                        .then(blog => {
                            // Check if user has liked the blog post
                            let blogLiked;
                            if (blog.Likes) {
                                blogLiked = blog.Likes.length !== 0;
                            } else {
                                blogLiked = false;
                            }

                            this.setState({
                                blogId: blog.id,
                                title: blog.title,
                                createdAt: blog.createdAt,
                                author: blog.User.firstname + ' ' + blog.User.lastname,
                                description: blog.description,
                                likes: blog.likesCount,
                                liked: blogLiked,
                                commentCount: blog.commentCount,
                                comments: blog.Comments
                            });
                            
                            // Populate blog body with content
                            // If there is an error with rendering the blog content, notify the user
                            try {
                                this.setState({
                                    editorState: EditorState.createWithContent(convertFromRaw(blog.content))
                                });
                            }
                            catch (err) {
                                this.setState({
                                    alert: VIEWBLOG.errorDisplay
                                });
                            }
                        });
                } else {
                    this.setState({
                        alert: VIEWBLOG.genericError
                    });
                }
            }
            )
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
                blogId: this.state.blogId
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
                    alert: LIKE.blogNotFound
                });
            } else if (res.status === 403) {
                this.setState({
                    alert: LIKE.accessDenied
                });
            } else {
                this.setState({
                    alert: LIKE.genericError
                });
            }
        });
    }

    comment(e) {
        e.preventDefault();
        // Visually indicate loading on submit button to user
        this.setState({
            isLoadingComment: true
        });

        fetch('/commentBlog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                blogId: this.state.blogId,
                comment: this.state.inputComment
            })
        }).then(res => {
            // Restore button to normal state (not loading)
            this.setState({
                isLoadingComment: false
            });

            if (res.status === 200) {
                res.json().then(res => {
                    this.setState({
                        inputComment: '',
                        commentCount: res.updatedCommentCount,
                        comments: [
                            // Since server returns comment and does not perform a join to find user,
                            // get user from app state and add to comment row
                            { ...res.affectedCommentRow, User: { firstname: this.props.user.firstname, lastname: this.props.user.lastname } },
                            ...this.state.comments
                        ]
                    });
                });
            } else if (res.status === 403) {
                this.setState({
                    alert: COMMENT.accessDenied
                });
            } else if (res.status === 404) {
                this.setState({
                    alert: COMMENT.blogNotFound
                });
            } else if (res.status === 400) {
                res.json().then(res => {
                    this.setState({
                        alert: res.alert
                    });
                });
            } else {
                this.setState({
                    alert: COMMENT.genericError
                });
            }
        })
            .catch(err => {
                // Restore button to normal state (not loading)
                this.setState({
                    isLoadingComment: false
                });
            });
    }

    // Show how long since the blog post was created. If over 24 hours, show date.
    formatWhenCreated(timeCreated) {
        let timeSince = Moment.duration(Moment(new Date()).diff(timeCreated));
        let hoursSince = timeSince.asHours();
        // First check in case local system time is slightly ahead of server time
        // This avoids a creation date that is pointing to the future (such as 'created in 1 minute')
        if (hoursSince < 0) {
            return (
                'a few seconds ago'
            )
        } else if (timeSince.asHours() >= 24) {
            return (
                Moment(timeCreated).format('MMM DD, YYYY')
            )
        } else {
            return (
                Moment(timeCreated).fromNow()
            )
        }
    }

    eachComment(comment) {
        return (
            <li className="media" key={comment.id}>
                <div className="comment-content media-body">
                <h5 className="comment-name mt-0"> {comment.User.firstname + ' ' + comment.User.lastname}</h5> 
                <p className="comment-time">{this.formatWhenCreated(comment.createdAt)}</p>
                <p>{comment.content} </p>
                </div>
            </li>
        )
    }

    handleInputChange(event) {
        this.setState({
            inputComment: event.target.value,
            // Hide alert when user changes input
            alert: ''
        });
    }

    render() {
        return (
            <div>
                <div className="backBtn">
                    <button className="btn btn-danger" onClick={this.props.history.goBack}>Back</button>
                </div>
                {this.state.showLoading ? (
                    <div className="text-center">
                    <Loading />
                    </div>
                ) : (
                        this.state.isLoading ? ('') : (
                            <div>
                                <div className="text-center">
                                    {/* Alert for error loading blog post */}
                                    {this.state.alert ? (
                                        <div className="alert alert-danger alert-dismissible">
                                            {this.state.alert}
                                            <button type="button" onClick={this.dismissAlert} className="close">&times;</button>
                                        </div>
                                    ) : ('')}
                                </div>

                                {/* Only display content if this blog exists (using title to check).
                                    This will avoid displaying an empty skeleton blog if it does not exist */}
                                {!(this.state.title === '') ? (
                                    <div>
                                        <h1 className="view-title">{this.state.title}</h1>
                                        <h3 className="author-time" label="By:"> {this.state.author}</h3>
                                        <h5 className="author-time">{Moment(this.props.createdAt).format('Do MMMM YYYY')}</h5>
                                        <h6 className="description">{this.state.description}</h6>

                                        <hr className="blog-hr"></hr>

                                        <div className="editor-display col-8">
                                            {<Editor editorState={this.state.editorState} readOnly />}

                                        </div>

                                        {/* Likes. If no likes, show 0 */}
                                        <div className="counter">
                                            {this.props.isLoggedIn ? (
                                                this.state.liked ? (
                                                    <button className="btn btn-primary" onClick={this.likeBlog}>Unlike</button>
                                                ) : (
                                                        <button className="btn btn-primary" onClick={this.likeBlog}>Like</button>
                                                    )
                                            ) : ('')}
                                            <p className="likes-text">Likes: {this.state.likes ? this.state.likes : 0}</p>
                                        </div>

                                        {/* Comment submission form */}
                                        <h2 className="comments-heading">Comments</h2>
                                        {this.props.isLoggedIn ? (
                                            <form className="comments-form form-inline form-row" onSubmit={this.comment}>
                                                <textarea disabled={this.state.isLoadingComment} className="col-6 form-control input-form" rows="5" placeholder="Comment" value={this.state.inputComment} onChange={this.handleInputChange} required></textarea>
                                                <button disabled={this.state.isLoadingComment} className="btn btn-primary ml-3" type="submit">{this.state.isLoadingComment ? ('Submitting...') : ('Submit')}</button>
                                            </form>
                                        ) : ('')}

                                        {/* Display existing comments or notify user none exist */}
                                        <div className="comments-section">
                                            {this.state.comments.length === 0 ? (
                                                <p>There are no comments yet!</p>
                                            ) : (this.state.comments.map(comment => this.eachComment(comment)))}
                                        </div>
                                    </div>
                                ) : ('')}
                            </div>
                        )
                    )}
            </div>
        )
    }

}

export default ViewBlogPost;
