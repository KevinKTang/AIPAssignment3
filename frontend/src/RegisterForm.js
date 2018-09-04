import React, { Component } from 'react';
import './styles/RegisterForm.css';

/*
    This component contains the register form used to
    create an account for the website
*/

class RegisterForm extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <form name="registerForm" className="register-form">
                <input className="register-input" type="text" placeholder="First Name" required/>
                <input className="register-input" type="text" placeholder="Last Name" required/> 
                <input className="register-input" type="text" placeholder="E-mail" required/>
                <input className="register-input" type="password" placeholder="Password" required/>
                <button className="register-submit-button">Submit</button>
            </form>
        );
    }
}

export default RegisterForm;