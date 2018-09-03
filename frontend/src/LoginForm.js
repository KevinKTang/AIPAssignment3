import React, { Component } from 'react';
import './styles/LoginForm.css';

/*
    This component contains the login form used to
    log in to the website
*/

class LoginForm extends Component {

    render() {
        return (
            <form className="login-form">
                <input className="login-input" type="text" placeholder="E-mail"/>
                <input className="login-input" type="password" placeholder="Password"/>
                <button className="submit-button">Submit</button>
            </form>
        );
    }
}

export default LoginForm;