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
            <nav className="navbar navbar-expand-sm fixed-top bg-dark d-print">
            <div>
                <Link className="navbar-brand" to="/">Off With His Read</Link>
                {/*this.props.isLoggedIn ? (<div className="welcome-text">Welcome, {this.props.userFirstname}.</div>) : ('')*/}
            </div>

                {this.props.isLoggedIn ? (
                    <div className="navbar-nav ml-auto">
                        <Link className="btn btn-secondary" to="/">Home</Link>
                        <Link className="btn btn-secondary" to="/myblogs">My Blogs</Link>
                        <Link className="btn btn-secondary" to="/createblog">Create Blog</Link>
                        <button className="btn btn-secondary" onClick={this.logout}>Logout</button>
                    </div>
                ) : (
                        <div className="navbar-nav ml-auto">
                            <Link className="btn btn-secondary" to="/">Home</Link>
                            <Link className="btn btn-secondary" to="/login">Login</Link>
                            <Link className="btn btn-secondary" to="/register">Register</Link>
                        </div>
                    )}
            </nav>
        )
    }
}

export default withRouter(Header);
