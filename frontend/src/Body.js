import React, { Component } from 'react';
import './styles/Body.css';
import BlogPosts from './body-components/BlogPosts.js';
import CreateBlog from './body-components/CreateBlog';

/* 
    The body component is responsible for displaying all the content of
    our website, it starts off displaying the cardview of recently added
    or most popular blogs and will change to display a user's blogs when
    interacting with the 'Your Posts' navigation link in the header.
*/


class Body extends Component {

    constructor(props) {
        super(props);
        this.bodyView = this.bodyView.bind(this);
    }

    // Update what the body shows based on user selection
    // Show blog posts by default
    bodyView() {
        switch (this.props.bodyView) {
            case 'blogs':
                return (
                    <div className="app-body">
                        <BlogPosts show={true} />
                        <CreateBlog show={false} />
                    </div>
                )
            case 'createBlog':
                return (
                    <div className="app-body">
                        <BlogPosts show={false} />
                        <CreateBlog show={true} />
                    </div>
                )
            default:
                return (
                    <div className="app-body">
                        <BlogPosts show={true} />
                        <CreateBlog show={false} />
                    </div>
                )
        }
    }

    render() {
        return(
            this.bodyView()
        )
    }
}

export default Body;