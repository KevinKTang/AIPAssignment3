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
            title: props.title,
            content: props.content
        }
    }

    // Blog posts that are displayed in the user's blog section can be deleted
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{this.state.title}</h5>
                    <div className="card-text">{this.state.content}</div>
                    {this.props.canDelete ? (
                        <button className="btn btn-danger delete-blog-button" onClick={() => this.props.deleteBlog(this.props.id)}>Delete</button>
                    ) : ('')}
                </div>
            </div>
        )
    }

}

export default BlogPost;
