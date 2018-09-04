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

    render() {
        return (
            <div className="blog-post">
                {this.state.title}
                <br></br>
                <br></br>
                {this.state.content}
            </div>
        )
    }
}


export default BlogPost;