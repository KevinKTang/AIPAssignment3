import React, { Component } from 'react';
import './styles/LoginForm.css';

/*
    This component contains the login form used to
    log in to the website
*/

class LoginForm extends Component {
    constructor(props) {
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
        .then(res => {
            if (res.status === 200) {
                res.json().then(userFirstname => {this.props.updateLogin(true, userFirstname)});
                console.log('Login successful');
                this.props.history.push('/');
            } else  if (res.status === 401) {
                console.log('Incorrect username or password');
                this.setState({
                    password: ''
                });
            } else {
                console.log('Error logging in');
            }
        })
        .catch(err => console.error('An error occured: ' + err));
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
                Login:
                    <input className="login-input" name="email" value={this.state.email} onChange={this.handleInputChange} type="text" placeholder="E-mail" required />
                <input className="login-input" name="password" value={this.state.password} onChange={this.handleInputChange} type="password" placeholder="Password" required />
                <button className="login-submit-button">Submit</button>
            </form>
        );
    }

}

export default LoginForm;
