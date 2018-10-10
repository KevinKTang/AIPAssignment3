import React, { Component } from 'react';
import { EditorState, convertFromRaw, Editor } from 'draft-js';
import Moment from 'moment';
import Loading from '../Loading'
import '../styles/ViewBlogPost.css'

class ViewBlogPost extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: true,
            showLoading: '',
            // Loading state for when submitting a comment
            isLoadingComment: false,
            alert: '',
            blogId: '',
            title: '',
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
        let blogId = this.props.location.pathname.substr(path.length - 1)
        fetch('/blog/' + blogId)
            .then(res => {
                this.setState({
                    isLoading: false,
                    showLoading: false
                });
                if (res.status === 200) {
                    res.json()
                        .then(blog => {
                            // Check if this user has liked the blog post
                            let blogLiked;
                            if (blog.likes) {
                                blogLiked = blog.likes.length !== 0;
                            } else {
                                blogLiked = false;
                            }

                            this.setState({
                                blogId: blog.id,
                                title: blog.title,
                                author: blog.user.firstname + ' ' + blog.user.lastname,
                                description: blog.description,
                                editorState: EditorState.createWithContent(convertFromRaw(blog.content)),
                                likes: blog.likesCount,
                                liked: blogLiked,
                                commentCount: blog.commentCount,
                                comments: blog.comments
                            });
                        });
                } else {
                    this.setState({
                        alert: 'Error retrieving blog post.'
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
                            {...res.affectedCommentRow, user: {firstname: this.props.user.firstname, lastname: this.props.user.lastname}},
                            ...this.state.comments
                        ]
                    });
                });
            } else if (res.status === 403) {
                this.setState({
                    alert: 'Error. You must be logged in to comment on blog posts.'
                });
            } else if (res.status === 404) {
                this.setState({
                    alert: 'Error. Blog post not found.'
                });
            } else {
                this.setState({
                    alert: 'Error commenting on blog post.'
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

    eachComment(comment) {
        return (
            <li key={comment.id}>
                {comment.user.firstname + ' ' + comment.user.lastname} | {comment.content} | {Moment(comment.createdAt).format('Do MMMM YYYY hh:mm A')}
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
                <div className="view-blog-backBtn">
                    <button className="btn btn-danger" onClick={this.props.history.goBack}>Back</button>
                </div>
                {this.state.showLoading ? (
                    <Loading />
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

                                <h1 className="view-blog-title">{this.state.title}</h1>
                                <h4 className="view-blog-author" label="By:"> {this.state.author}</h4>
                                <h6 className="view-blog-description">{this.state.description}</h6>

                                <hr className="view-blog-hr"></hr>
                                <div className="editor-display">
                                    {<Editor editorState={this.state.editorState} readOnly />}
                                </div>

                                <div className="counter">
                                 {/* Likes. If no likes, show 0 */}
                                {this.props.isLoggedIn ? (
                                    this.state.liked ? (
                                        <button className="btn btn-primary" onClick={this.likeBlog}>Unlike</button>
                                    ) : (
                                            <button className="btn btn-primary" onClick={this.likeBlog}>Like</button>
                                        )
                                ) : ('')}
                                <h6>Likes: {this.state.likes ? this.state.likes : 0}</h6>
                                <h6>Comments: {this.state.commentCount ? this.state.commentCount : 0}</h6>
                                </div>

                               


                                {/* Comments Section. If no comments, indicate this to the user */}
                                {/* Comment form */}
                                <form className="form-group" onSubmit={this.comment}>
                                    <input className="form-control" placeholder="Comment" value={this.state.inputComment} onChange={this.handleInputChange} required></input>
                                    <button disabled={this.state.isLoadingComment} className="btn btn-primary" type="submit">{this.state.isLoadingComment ? ('Submitting...') : ('Submit')}</button>
                                </form>
                                <div className="view-blog-comments-section">
                                <h2>Comments</h2>
                                {this.state.comments.length === 0 ? (<p>Be the first to write a comment!</p>) : (this.state.comments.map(comment => this.eachComment(comment)))}
                                </div>
                            </div>
                        )
                    )}
            </div>
        )
    }

}

export default ViewBlogPost;
