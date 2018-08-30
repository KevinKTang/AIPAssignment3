import React, { Component } from 'react';
import './styles/Header.css';

/*
    This header component simply displays our website name
    and contains a login button and once logged in will contain
    navigation to Account Settings, Your Posts and Logout
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

    loginForm() {
        return (
            <form>
                <input className="email" type="text" placeholder="E-mail"/>
                <input className="password" type="password" placeholder="Password"/>
                <button className="submit-button">Submit</button>
            </form>
        )
    }

    render() {
        return(
            <div className="header">
                <span className="header-text">Off With His Read</span>
                <span>
                    <button className="login-button" onClick={this.togglelogin}>Login</button>
                    {this.state.login ? this.loginForm() : ''}
                </span>
            </div>
        )
    }
}

export default Header;