import React, { Component } from 'react';
import { withRouter } from 'react-router';
import {Switch, Route } from 'react-router-dom';
import LoginForm from './body-components/LoginForm';
import RegisterForm from './body-components/RegisterForm';
import BlogPosts from './body-components/BlogPosts.js';
import CreateBlog from './body-components/CreateBlog.js';
import MyBlogs from './body-components/MyBlogs.js';
import ViewBlogPost from './body-components/ViewBlogPost.js'
import './styles/Body.css';

/* 
    The body component is responsible for displaying all the content of
    our website. It starts off displaying the cardview of recently added
    blogs and will change depending on the user's selection in the header.
*/

class Body extends Component {

    constructor(props) {
        super();
        this.state = {
            blogsView: 'recent',
            refreshView: false
        }
        this.updateBlogsView = this.updateBlogsView.bind(this);
        this.updateComplete = this.updateComplete.bind(this);
    }

    updateBlogsView(view) {
        this.setState({
            blogsView: view,
            refreshView: true
        });
    }

    updateComplete() {
        this.setState({
            refreshView: false
        });
    }

    render() {
        return(
            // Update what the body shows based on user selection from the header
            <main className="app-body">
                <Switch>
                    <Route exact path="/"
                    render={(props) => <BlogPosts {...props} isLoggedIn={this.props.isLoggedIn} blogsView={this.state.blogsView} updateBlogsView={this.updateBlogsView} refreshView={this.state.refreshView} updateComplete={this.updateComplete} />} />
                    <Route
                        exact path="/login"
                        render={(props) => <LoginForm {...props} updateLogin={this.props.updateLogin} />} />
                    <Route
                        exact path="/register"
                        render={(props) => <RegisterForm {...props} updateLogin={this.props.updateLogin} />} />
                    <Route
                        exact path="/myblogs"
                        render={(props) => <MyBlogs  {...props} isLoggedIn={this.props.isLoggedIn} /> } />
                    <Route
                        exact path="/createblog"
                        component={CreateBlog} />

                    <Route
                        path="/viewBlogPost"
                        render={(props) => <ViewBlogPost {...props} isLoggedIn={this.props.isLoggedIn} user={this.props.user} />} />
                </Switch>
            </main>
        )
    }

}

export default withRouter(Body);
