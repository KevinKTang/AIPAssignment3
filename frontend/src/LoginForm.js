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

    checkLogin(event) {
        fetch(`http://localhost:3000/finduser?email=${this._inputEmail.value}`)
        .then(res => res.json())
        .then(res => {
            if (res == '') {
                // If no user with that email found
                console.log('Username or password incorrect');
                this._inputPassword.value = '';
            }
            // If username and password correct
            else if (res[0].password === this._inputPassword.value) { // Check [0] syntax later
                console.log('Login successful')
            }
            // If password incorrect
            else {
                this._inputPassword.value = '';
                console.log('Username or password incorrect');
            }
        }); 
        event.preventDefault();
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