import React, { Component } from 'react';

class Welcome extends Component {

    /*
        The Welcome component displays a welcome jumbotron to welcome new users 
        to the website and is displayed on the home screen if not logged in.
    */

    render() {
        return (
            <div className="jumbotron">
                <p className="display-4">Welcome!</p>
                <p className="lead">This website is for bloggers, writers and the like!</p>
                <hr></hr>
                <p>Get started by logging in or creating an account to create your own blog posts, or view some of our recent posts below.</p>
            </div>
        )
    }

}

export default Welcome;
