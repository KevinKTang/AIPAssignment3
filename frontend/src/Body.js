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

    bodyView() {
        switch (this.props.bodyContent) {
            case 'blogs':
                return (
                    <BlogPosts />
                );
            case 'createBlog':
                return (
                    <CreateBlog />
                );
        }
    }

    render() {
        return(
            <div className="app-body">
                {this.bodyView()}
            </div>
        )
    }
}

export default Body;