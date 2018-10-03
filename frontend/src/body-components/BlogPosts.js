import React, { Component } from 'react';
import BlogPost from './BlogPost.js';
import Loading from '../Loading.js';
import Welcome from './Welcome.js'
import '../styles/BlogPosts.css';

/*
    BlogPosts component is simply a container holding
    the individual BlogPost(s) and divides them up into a card view
    for the main page of our website.
*/

class BlogPosts extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoading: true,
            showLoading: '',
            blogs: []
        }
        this.eachBlog = this.eachBlog.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.timer = setInterval(this.startLoading, 500);
    }

    // Loading icon will only show after half a second
    // This avoids it flashing on screen briefly before content loads
    startLoading() {
        if (this.state.isLoading) {
            this.setState({showLoading: true});
        }
        clearInterval(this.timer);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    // Get blog posts from database on start
    componentDidMount() {
        this.setState({isLoading: true});
        fetch('/blogs')
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(res => this.setState({
                            blogs: res,
                            isLoading: false,
                            showLoading: false
                        }));
                }
            })
            .catch(err => console.error('An error occurred: ' + err));
    }

    // Currently unused
    updateBlogs() {
        fetch('/blogs')
        .then(res => {
            if (res.status === 200) {
                res.json()
                    .then (res => this.setState({blogs: res}))
            }
        })
        .catch(err => console.error('An error occurred: ' + err));
    }

    // Function to loop through and render the blogs
    eachBlog(blog) {
        // If logged in, allow ability to like a blog post
        if (this.props.isLoggedIn) {
            return (
                <BlogPost
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    content={blog.content}
                    likes={blog.likes}
                    likeable={true}>
                </BlogPost>
            );
        } else {
            return (
                <BlogPost
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    content={blog.content}
                    likes={blog.likes}
                    likeable={false}>
                </BlogPost>
            );
        }
    }

    render() {
        return (
            this.state.showLoading ? (
                <div>
                    {this.props.isLoggedIn ? '' : <Welcome />}
                    <Loading />
                </div>
            ) : (
                    this.state.blogs.length === 0 && this.state.isLoading === false ? (
                        <div>
                            {this.props.isLoggedIn ? '' : <Welcome />}
                            <p>There are no blogs to display!</p>
                        </div>
                    ) : (
                            <div>
                                {this.props.isLoggedIn ? '' : <Welcome />}
                                <div className="blog-posts-flex">
                                    {this.state.blogs.map(blog => this.eachBlog(blog))}
                                </div>
                            </div>
                        )
                )
        )
    }

}

export default BlogPosts;
