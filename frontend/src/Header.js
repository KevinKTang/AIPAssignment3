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
            login: false,
            register: false
        }
        this.togglelogin = this.togglelogin.bind(this);
        this.toggleregister = this.toggleregister.bind(this);
    }

    loginButton() {
        return <button className="login-button" onClick={this.togglelogin}>Login</button>
    }

    registerButton() {
        return <button className="register-button" onClick={this.toggleregister}>Register</button>
    }
    // Change if the login button shows the form or not
    togglelogin() {
        this.setState(prevState => ({
            login: !prevState.login
        }));
    }
    // Change if the register button shows the form or not
    toggleregister() {
        this.setState(prevState => ({
            register: !prevState.register
        }));
    }

    render() {

        return (
            <div className="header">
                <div className="header-text">Off With His Read</div>
                <div className="login-section">


                    {this.state.login ? (
                        <div>
                            <LoginForm />
                            {this.loginButton()}
                            {this.registerButton()}
                        </div>
                    ) : (<div>
                        {this.loginButton()}
                        {this.registerButton()}
                    </div>
                        )}

                    {this.state.register ? (
                        <RegisterForm />
                    ) : (''
                        )}

                </div>
            </div>

        )
    }
}

export default Header;