import React, { Component } from 'react';
import './styles/LoginForm.css';

/*
    This component contains the login form used to
    log in to the website
*/

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        }
        this.login = this.login.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    // Send username and password to server, check if login successful
    login(event) {
        event.preventDefault();
        fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res) {
                console.log('Logged in successfuly');
            } else {
                console.log('Incorrect username or password');
            }
        });
    }

    // Update the state to reflect user input
    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        });
    }

    render() {
        return (
            <form onSubmit={this.login} name="loginForm" className="login-form">
                <input className="login-input" name="email" value={this.state.email} onChange={this.handleInputChange} type="text" placeholder="E-mail" required/>
                <input className="login-input" name="password" value={this.state.password} onChange={this.handleInputChange} type="password" placeholder="Password" required/>
                <button className="login-submit-button">Submit</button>
            </form>
        );
    }
}

export default LoginForm;