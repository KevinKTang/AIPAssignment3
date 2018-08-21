import React, { Component } from 'react';
import './Body.css';
import BlogPost from './BlogPost.js';

class Body extends Component {
    render() {
        return(
            <div className="appbody">
                <BlogPost></BlogPost>
                <BlogPost></BlogPost>
                <BlogPost></BlogPost>
            </div>
        )
    }
}

export default Body;