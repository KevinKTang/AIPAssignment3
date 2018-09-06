import React, { Component } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './styles/Header.css';


/*
    This header component simply displays our website name
    and contains a login button. Once logged in will contain
    navigation to Account Settings, Your Posts and Logout.
*/

class Header extends Component {

    constructor() {
        super();
        this.state = {
            display: '',
            username: ''
        }
        this.toggleLogin = this.toggleLogin.bind(this);
        this.toggleRegister = this.toggleRegister.bind(this);
    }

    loginButton() {
        return <button className="login-button" onClick={this.toggleLogin}>Login</button>
    }

    registerButton() {
        return <button className="register-button" onClick={this.toggleRegister}>Register</button>
    }

    // Change if the login button shows the form or not
    toggleLogin() {
        if (this.state.display === 'login')
            this.setState({display: ''})
        else 
            this.setState({display: 'login'})
    }

    // Change if the register button shows the form or not
    toggleRegister() {
        if (this.state.display === 'register')
            this.setState({display: ''})
        else 
            this.setState({display: 'register'})
    }

    // Set the username if a user is logged in
    componentWillMount() {
        fetch('/getFirstname', {
            credentials: 'include'
        })
        .then(res => res.json())
        .then(result => {
            this.setState({username: result})
        });
    }

    render() {
        return (
            <div className="header">
                <div className="header-text">
                <div>Off With His Read</div>
                <div>Welcome {this.state.username}</div>
                </div>
                <div className="login-section">
                    {this.state.display === '' ? (
                        <div>
                            {this.loginButton()}
                            {this.registerButton()}
                        </div>
                    ) : ''}
                    {this.state.display === 'login' ? (
                        <div>
                            <LoginForm />
                            {this.loginButton()}
                            {this.registerButton()}
                        </div>
                    ) : ''}
                    {this.state.display === 'register' ? (
                        <div>
                            <RegisterForm />
                            {this.loginButton()}
                            {this.registerButton()}
                        </div>
                    ) : ''}
                </div>
            </div>
        )
    }
}

export default Header;