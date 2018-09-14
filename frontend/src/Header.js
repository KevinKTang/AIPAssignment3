import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import './styles/Header.css';

/*
    This header component simply displays our website name
    and contains a login button. Once logged in will contain
    navigation to Account Settings, Your Posts and Logout.
*/

class Header extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoginForm: false,
            isRegisterForm: false
        }
        this.logout = this.logout.bind(this);
    }

    logout() {
        fetch('/logout')
            .then((res) => {
                this.props.updateLogin(false, '');
                console.log('Log out successful');
                this.props.history.push('/');
            });
    }
    
    render() {
        return (
            <div className="header">
                <div className="header-text">
                    <div>Off With His Read</div>
                    {this.props.isLoggedIn ? (<div className="welcome-text">Welcome, {this.props.userFirstname}.</div>) : ('')}
                </div>

                {this.props.isLoggedIn ? (
                    <div>
                        <Link className="home-link" to="/">Home</Link>
                        <Link className="myblogs-link" to="/myblogs">My Blogs</Link>
                        <Link className="createblog-link" to="/createblog">Create Blog</Link>
                        <button className="logout-button" onClick={this.logout}>Logout</button>
                    </div>
                ) : (
                        <div>
                            <Link className="home-link" to="/">Home</Link>
                            <Link className="login-link" to="/login">Login</Link>
                            <Link className="register-link" to="/register">Register</Link>
                        </div>
                    )}
            </div>
        )
    }
}

export default withRouter(Header);
