import React, { Component } from 'react';
import '../styles/BlogPost.css';

/* 
    Blog Post cards will be displayed on the main page
    they will display a title, image where it is available
    and a summary or short blurb of the blog content.
*/

class BlogPost extends Component {

    constructor() {
        super();
        this.state = {
            title: 'Blog Post',
            body: 'This is some sample blog post body content. It will display the first few sentences of the post.'
        }
    }

    render() {
        return (
            <div className="blog-post">
                {this.state.title}
                <br></br>
                <br></br>
                {this.state.body}
            </div>
        )
    }
}


export default BlogPost;