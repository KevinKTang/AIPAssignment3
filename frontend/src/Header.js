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
            // Used to indicate if trying to log out
            isLoading: false,
            isLoginForm: false,
            isRegisterForm: false
        }
        this.logout = this.logout.bind(this);
    }
    
    logout() {
        this.setState({
            isLoading: true
        });
        fetch('/logout')
            .then((res) => {
                this.setState({
                    isLoading: false
                });
                this.props.updateLogin(false, '');
                this.props.history.push('/');
            })
            .catch(err => {
                this.setState({
                    isLoading: false
                });
            })
    }
    
    render() {
        return (
            <header className="navbar navbar-expand-md fixed-top bg-dark d-print">
            <div>
                <Link className="navbar-brand" to="/">Off With His Read</Link>
                {this.props.isLoggedIn ? (<div className="navbar-text mx-auto"> Welcome, {this.props.userFirstname}</div>) : ('')}
            </div>

                {this.props.isLoggedIn ? (
                    <div className="navbar-nav ml-auto">
                        <Link className="btn btn-primary header-btn" to="/">Home</Link>
                        <Link className="btn btn-info header-btn" to="/myblogs">My Blogs</Link>
                        <Link className="btn btn-info header-btn" to="/createblog">Create Blog</Link>
                        <button disabled={this.state.isLoading} className="btn btn-danger header-btn" onClick={this.logout}>{this.state.isLoading ? ('Logging out...') : ('Logout')}</button>
                    </div>
                ) : (
                        <div className="navbar-nav ml-auto">
                            <Link className="btn btn-primary header-btn" to="/">Home</Link>
                            <Link className="btn btn-info header-btn" to="/login">Login</Link>
                            <Link className="btn btn-info header-btn" to="/register">Register</Link>
                        </div>
                    )}
            </header>
        )
    }
    
}

export default withRouter(Header);
