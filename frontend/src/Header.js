import React, { Component } from 'react';
import LoginForm from './LoginForm';
import './styles/Header.css';

/*
    This header component simply displays our website name
    and contains a login button. Once logged in will contain
    navigation to Account Settings, Your Posts and Logout.
*/ 

class Header extends Component {

    constructor() {
        super();
        this.state = {
            login: false
        }
        this.togglelogin = this.togglelogin.bind(this);
    }
    togglelogin() {
        this.setState(prevState => ({
            login: !prevState.login
        }));
    }

    render() {
        return(
            <div className="header">
                <span className="header-text">Off With His Read</span>
                <span>
                    <button className="login-button" onClick={this.togglelogin}>Login</button>
                    {this.state.login ? <LoginForm /> : ''}
                </span>
            </div>
        )
    }
}

export default Header;