import React, { Component } from 'react';
import { withRouter } from 'react-router';
import {Switch, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import BlogPosts from './body-components/BlogPosts.js';
import CreateBlog from './body-components/CreateBlog.js';
import MyBlogs from './body-components/MyBlogs.js';
import './styles/Body.css';

/* 
    The body component is responsible for displaying all the content of
    our website. It starts off displaying the cardview of recently added
    blogs and will change depending on the user's selection in the header.
*/

class Body extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blogToAdd: '',
            blogIdToDelete: ''
        }
        this.addBlog = this.addBlog.bind(this);
        this.removeBlog = this.removeBlog.bind(this);
    }

    // Function to update components with the newly added blog
    addBlog(blog) {
        this.setState({blogToAdd: blog});
        this.props.history.push('/myblogs');
    }

    // Function to remove blog from main page
    removeBlog(blogId) {
        this.setState({blogIdToDelete: blogId});
    }

    render() {
        return(
            // Update what the body shows based on user selection from the header
            <Switch>
                <Route exact path="/" component={BlogPosts} />
                <Route
                    exact path="/login"
                    render={(props) => <LoginForm {...props} updateLogin={this.props.updateLogin} />} />
                <Route
                    exact path="/register"
                    render={(props) => <RegisterForm {...props} updateLogin={this.props.updateLogin} />} />
                <Route
                    exact path="/myblogs"
                    render={(props) => <MyBlogs {...props} removeBlog={this.removeBlog} />} />
                <Route
                    exact path="/createblog"
                    render={(props) => <CreateBlog {...props} addBlog={this.addBlog} />} />
            </Switch>
        )
    }

}

export default withRouter(Body);
