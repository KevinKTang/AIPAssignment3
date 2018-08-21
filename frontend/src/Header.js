import React, { Component } from 'react';
import './Header.css';

class Header extends Component {

    constructor() {
        super();
        this.state = {
            showLogin: false
        }
        this.toggleShowLogin = this.toggleShowLogin.bind(this);
    }

    toggleShowLogin() {
        this.setState(prevState => ({
            showLogin: !prevState.showLogin
        }));
    }

    loginForm() {
        return (
            <form className="loginform">
                <input type="text" placeholder="username"/>
                <input type="password" placeholder="password"/>
                <button>-></button>
            </form>
        )
    }

    render() {
        return(
            <div className="header">
                <span className="headertext">Off With His Read</span>
                <span>
                    <button className="loginButton" onClick={this.toggleShowLogin}>Login</button>
                </span>
                {this.state.showLogin ? this.loginForm() : ''}
            </div>
        )
    }
}

export default Header;