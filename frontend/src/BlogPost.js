import React, { Component } from 'react';
import './styles/BlogPost.css';

class BlogPost extends Component {
    render() {
        return (
            <div className="blog-post">
                Blog Post
                <br></br>
                <br></br>
                This is some sample blog post body content. It will display the first few sentences of the post.
            </div>
        )
    }
}


export default BlogPost;