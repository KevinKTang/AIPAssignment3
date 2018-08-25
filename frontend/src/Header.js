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

    // toggle the login state
    togglelogin() {
        this.setState(prevState => ({
            login: !prevState.login
        }));
    }

    loginForm() {
        return (
            <form>
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
                    <button onClick={this.togglelogin}>Login</button>
                </span>
                {this.state.login ? this.loginForm() : ''}
                <hr></hr>
            </div>
        )
    }
}

export default Header;