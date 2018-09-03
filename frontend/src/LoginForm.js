import React, { Component } from 'react';
import './styles/LoginForm.css';

/*
    This component contains the login form used to
    log in to the website
*/

class LoginForm extends Component {

    render() {
        return (
            <form>
                <input type="text" placeholder="E-mail"/>
                <input type="password" placeholder="Password"/>
                <button>Submit</button>
            </form>
        );
    }
}

export default LoginForm;