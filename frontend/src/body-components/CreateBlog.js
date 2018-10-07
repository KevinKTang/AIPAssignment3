import React, { Component } from 'react';
import '../styles/CreateBlog.css';
import MyEditor from './MyEditor.js';

/*
    This component contains the form used to create
    a blog post
*/

class CreatePost extends Component {
    constructor(props) {
        super();
        this.state = {
            title: '',
            content: '',
            alert: ''
        }
        this.newBlog = this.newBlog.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
    }
    
    newBlog(event) {
        event.preventDefault();
        fetch('/createBlog', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: this.state.title,
                content: this.state.content
            })
        }).then(res => {
            if (res.status === 201) {
                this.setState({
                    title: '',
                    content: ''
                });
                this.props.history.push("/myBlogs");
            } else if (res.status === 403) {
                this.setState({
                    alert: "Access denied. Make sure you're logged in before creating a blog post."
                });
            } else {
                this.setState({
                    alert: 'Error creating new blog post.'
                });
            }
        })
        .catch(err => console.error('An error occurred: ' + err));
    }

    dismissAlert() {
        this.setState({
            alert: ''
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value,
            // Hide alert when user changes input
            alert: ''
        });
    }

    render() {
        return (
            <div>
                {/* Alert for incorrect blog post */}
                {this.state.alert ? (
                    <div className="alert alert-danger alert-dismissible">
                        {this.state.alert}
                        <button type="button" onClick={this.dismissAlert} className="close">&times;</button>
                    </div>
                ) : ('')}

                <h1>New Blog Post</h1>
                {/* Blog post form */}
                <form onSubmit={this.newBlog}>
                    <input className="create-post-input" name="title" value={this.state.title} onChange={this.handleInputChange} type="text" placeholder="Title" required></input>
                    <textarea rows="10" cols="50" name="content" value={this.state.content} onChange={this.handleInputChange} className="create-post-input" placeholder="Blog post content" required></textarea>
                    <button className="btn btn-primary">Post</button>
                </form>
                <MyEditor />
            </div>
        )

    }

}

export default CreatePost;
