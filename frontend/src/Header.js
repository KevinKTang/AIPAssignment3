import React, { Component } from 'react';
import './styles/Header.css';

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
                <input className="username" type="text" placeholder="Username"/>
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