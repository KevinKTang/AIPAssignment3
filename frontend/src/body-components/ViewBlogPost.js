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
            title: '',
            blurb: '',
            // Initialise empty editorState so we can add content later
            editorState: EditorState.createEmpty(),
            author: '',
            likes: '',
            liked: ''
        }
        this.startLoading = this.startLoading.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
        this.likeBlog = this.likeBlog.bind(this);
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
                            // Check if this user has liked the blog post
                            let blogLiked;
                            if (blog.likes) {
                                blogLiked = blog.likes.length !== 0;
                            } else {
                                blogLiked = false;
                            }

                            this.setState({
                                title: blog.title,
                                blurb: blog.blurb,
                                editorState: EditorState.createWithContent(convertFromRaw(blog.content)),
                                author: blog.user.firstname + blog.user.lastname,
                                likes: blog.likesCount,
                                liked: blogLiked
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
        let path = this.props.location.pathname;
        let blogId = this.props.location.pathname.substr(path.length-1)
        fetch('/likeBlog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                blogId: blogId
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

                            <h2>{this.state.title}</h2>
                            <p>By {this.state.author}</p>
                            <hr></hr>
                            <p>{this.state.blurb}</p>
                            <p>Likes: {this.state.likes ? this.state.likes : 0}</p>
                            {<Editor editorState={this.state.editorState} readOnly />}

                            {this.props.isLoggedIn ? (
                                this.state.liked ? (
                                    <button className="btn btn-primary" onClick={this.likeBlog}>Unlike</button>
                                ) : (
                                        <button className="btn btn-primary" onClick={this.likeBlog}>Like</button>
                                    )
                            ) : ('')}

                        </div>
                    )
                )}
            </div>
        )
    }

}

export default ViewBlogPost;
