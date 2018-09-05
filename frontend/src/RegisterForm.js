import React, { Component } from 'react';
import './styles/RegisterForm.css';

/*
    This component contains the register form used to
    create an account for the website
*/

class RegisterForm extends Component {
    constructor() {
        super();
        this.registerUser = this.registerUser.bind(this);
    }

    registerUser(event) {
        event.preventDefault();
        fetch('/createUser', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstname: this._inputFirstname.value,
                lastname: this._inputLastname.value,
                email: this._inputEmail.value,
                password: this._inputPassword.value
            })
        }).then(document.getElementById('registerForm').submit());
    }

    render() {
        return (
            <form onSubmit={this.registerUser} id="registerForm" className="register-form">
                <input className="register-input" ref={input => this._inputFirstname = input} type="text" placeholder="First Name" required/>
                <input className="register-input" ref={input => this._inputLastname = input} type="text" placeholder="Last Name" required/> 
                <input className="register-input" ref={input => this._inputEmail = input} type="text" placeholder="E-mail" required/>
                <input className="register-input" ref={input => this._inputPassword = input} type="password" placeholder="Password" required/>
                <button className="register-submit-button">Submit</button>
            </form>
        );
    }
}

export default RegisterForm;