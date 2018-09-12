import React, { Component } from 'react';
import './styles/Body.css';
import BlogPosts from './body-components/BlogPosts.js';
import CreateBlog from './body-components/CreateBlog.js';
import MyBlogs from './body-components/MyBlogs.js';

/* 
    The body component is responsible for displaying all the content of
    our website, it starts off displaying the cardview of recently added
    or most popular blogs and will change to display a user's blogs when
    interacting with the 'Your Posts' navigation link in the header.
*/

class Body extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blogToAdd: '',
            blogIdToDelete: ''
        }
        this.bodyView = this.bodyView.bind(this);
        this.addBlog = this.addBlog.bind(this);
        this.removeBlog = this.removeBlog.bind(this);
    }

    // Function to update components with the newly added blog
    addBlog(blog) {
        this.setState({blogToAdd: blog});
        this.props.updateBodyView('blogs');
    }

    // Function to remove blog from main page
    removeBlog(blogId) {
        this.setState({blogIdToDelete: blogId});
    }

    // Update what the body shows based on user selection
    // Show blog posts by default
    bodyView() {
        switch (this.props.bodyView) {
            case 'blogs':
                return (
                    <div className="app-body">
                        <BlogPosts show={true} blogToAdd={this.state.blogToAdd} isLoggedIn={this.props.isLoggedIn} blogIdToDelete={this.state.blogIdToDelete} />
                        <MyBlogs show={false} blogToAdd={this.state.blogToAdd} isLoggedIn={this.props.isLoggedIn} removeBlog={this.removeBlog} />
                        <CreateBlog show={false} addBlog={this.addBlog} />
                    </div>
                )
            case 'createBlog':
                return (
                    <div className="app-body">
                        <BlogPosts show={false} blogToAdd={this.state.blogToAdd} isLoggedIn={this.props.isLoggedIn} blogIdToDelete={this.state.blogIdToDelete} />
                        <MyBlogs show={false} blogToAdd={this.state.blogToAdd} isLoggedIn={this.props.isLoggedIn} removeBlog={this.removeBlog} />
                        <CreateBlog show={true} addBlog={this.addBlog} />
                    </div>
                )
            case 'myblogs':
                return (
                    <div className="app-body">
                        <BlogPosts show={false} blogToAdd={this.state.blogToAdd} isLoggedIn={this.props.isLoggedIn} blogIdToDelete={this.state.blogIdToDelete} />
                        <MyBlogs show={true} blogToAdd={this.state.blogToAdd}  isLoggedIn={this.props.isLoggedIn} removeBlog={this.removeBlog} />
                        <CreateBlog show={false} addBlog={this.addBlog} />
                    </div>

                )
        
            default:
                return (
                    <div className="app-body">
                        <BlogPosts show={true} />
                        <MyBlogs show={false} />
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