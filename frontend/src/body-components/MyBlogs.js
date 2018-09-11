import React, { Component } from 'react';
import '../styles/MyBlogs.css';
import BlogPost from './BlogPost';

class MyBlogs extends Component {
    constructor(props) {
        super();
        this.state = {
            blogs: []
        }
        this.eachBlog = this.eachBlog.bind(this);
    }
    
    componentDidMount() {
        fetch('/myblogs')
        .then(res => {
            if (res.status === 200) {
                res.json()
                    .then (res => this.setState({blogs: res}))
            }
        })
    }

    // If there is a new blog to add, add it to the state
    componentDidUpdate(prevProps) {
        if ((this.props.blogToAdd !== prevProps.blogToAdd) && this.props.blogToAdd !== '') {
            this.setState({
                blogs: [
                    ...this.state.blogs,
                    this.props.blogToAdd
                ]
            });
        }
    }

    // Create blog post from data from database
    eachBlog(blog) {
        return(
            <BlogPost
                key={blog.id}
                title={blog.title}
                content={blog.content}>
            </BlogPost>
        );
    }

    render() {
        if (this.props.show) {
            return (
                <div className="blog-posts-flex">
                    {this.state.blogs.map(blog => this.eachBlog(blog))}
                </div>
            )
        } else {
            return null;
        }
    }
    

}

export default MyBlogs;