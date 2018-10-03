import React, { Component } from 'react';
import '../styles/BlogPost.css';

/* 
    Blog Post cards will be displayed on the main page
    they will display a title, image where it is available
    and a summary or short blurb of the blog content.
*/

class BlogPost extends Component {

    constructor(props) {
        super();
        this.state = {
            likes: props.likes,
            alert: ''
        }
        this.likeBlog = this.likeBlog.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
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
                this.setState({
                    likes: this.state.likes + 1,
                    alert: ''
                });
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
                        <div className="card-text">{this.props.content}</div>
                        <hr></hr>
                        {/* If no likes, show 0 */}
                        <p>Likes: {this.state.likes ? this.state.likes : 0}</p>
                        {/* If being viewed as my blogs, show delete option and number of likes */}
                        {this.props.canDelete ? (
                            <button className="btn btn-danger" onClick={() => this.props.deleteBlog(this.props.id)}>Delete</button>
                        ) : ('')}

                        {/* If being viewed while logged in, show number of likes and option to like */}
                        {this.props.likeable ? (
                            <button className="btn btn-primary" onClick={this.likeBlog}>Like</button>
                        ) : ('')}
                                
                            
                    </div>
                </div>
            </div>
        )
    }

}

export default BlogPost;
