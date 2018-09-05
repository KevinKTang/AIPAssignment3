import React, { Component } from 'react';
import './styles/LoginForm.css';

/*
    This component contains the login form used to
    log in to the website
*/

class LoginForm extends Component {
    constructor() {
        super();
        this.checkLogin = this.checkLogin.bind(this);
    }

    // Send username and password to server, check if login successful
    checkLogin(event) {
        event.preventDefault();
        fetch(`http://localhost:5000/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this._inputEmail.value,
                password: this._inputPassword.value
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res) {
                // Create session
                console.log('Logged in successfuly');
            } else {
                console.log('Incorrect username or password');
            }
        });
    }

    render() {
        return (
            <form onSubmit={this.checkLogin} name="loginForm" className="login-form">
                <input className="login-input" ref={input => this._inputEmail = input} type="text" placeholder="E-mail" required/>
                <input className="login-input" ref={input => this._inputPassword = input} type="password" placeholder="Password" required/>
                <button className="login-submit-button">Submit</button>
            </form>
        );
    }
}

export default LoginForm;