import React, { Component } from 'react';
import Loading from '../Loading'
import { EditorState, convertFromRaw, Editor, ContentState} from 'draft-js';
import '../styles/ViewBlogPost.css'

class ViewBlogPost extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: true,
            showLoading: '',
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
            this.setState({showLoading: true});
        }
        clearInterval(this.timer);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    componentDidMount() {
        let path = this.props.location.pathname;
        let blogId = this.props.location.pathname.substr(path.length-1)
        fetch('/blog/' + blogId)
            .then(res => {
                this.setState({
                    isLoading: false,
                    showLoading: false
                });
                if (res.status === 200) {
                    res.json()
                        .then(blog => {
                            console.log(blog)
                            console.log(blog.comments)
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
                                //comments: blog.comment
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
        fetch('/commentBlog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                blogId: this.state.blogId,
                comment: this.state.inputComment
            })
        }).then(res => {
            if (res.status === 200) {
                res.json().then(res => {
                    this.setState({
                        inputComment: '',
                        commentCount: res.updatedCommentCount
                    })
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
        });
    }

    eachComment(comment) {
        return (
            <div>
                <p>comment.name</p>
                <p>comment.content</p>
            </div>
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
            <button className="btn btn-danger" onClick={this.props.history.goBack}>Back</button>
            {this.state.showLoading ? (
                <Loading />
            ) : (
                    this.state.isLoading ? ('') : (
                        <div>
                            {/* Alert for error loading blog post */}
                            {this.state.alert ? (
                                <div className="alert alert-danger alert-dismissible">
                                    {this.state.alert}
                                    <button type="button" onClick={this.dismissAlert} className="close">&times;</button>
                                </div>
                            ) : ('')}

                            <h1>{this.state.title}</h1>
                            <h2>By {this.state.author}</h2>
                            <hr></hr>
                            <p>{this.state.description}</p>
                            <div className="editor-display">
                                {<Editor editorState={this.state.editorState} readOnly />}
                            </div>

                             {/* Likes. If no likes, show 0 */}
                            <p>Likes: {this.state.likes ? this.state.likes : 0}</p>

                            {this.props.isLoggedIn ? (
                                this.state.liked ? (
                                    <button className="btn btn-primary" onClick={this.likeBlog}>Unlike</button>
                                ) : (
                                        <button className="btn btn-primary" onClick={this.likeBlog}>Like</button>
                                    )
                            ) : ('')}
                            {/* Comments. If no comments, show 0 */}
                            <p>Comments: {this.state.commentCount ? this.state.commentCount : 0}</p>

                            <h2>Comments</h2>
                            {this.state.comments.map(comment => this.eachComment(comment))}
                            {/* Comment form */}
                            <p>Comment:</p>
                            <form className="col-sm-9 col-md-7 col-lg-5 mx-auto" onSubmit={this.comment}>
                                <input className="form-control" placeholder="Comment" value={this.state.inputComment} onChange={this.handleInputChange} required></input>
                                <button className="btn btn-primary" type="submit">Submit</button>
                            </form>
                            
                        </div>
                    )
                )}
            </div>
        )
    }

}

export default ViewBlogPost;
