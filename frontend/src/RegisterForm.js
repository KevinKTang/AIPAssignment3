import React, { Component } from 'react';
import './styles/RegisterForm.css';

/*
    This component contains the register form used to
    create an account for the website
*/

class RegisterForm extends Component {
    constructor(props) {
        super();
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: ''
        }
        this.register = this.register.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    register(event) {
        event.preventDefault();
        fetch('/newUser', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                email: this.state.email,
                password: this.state.password
            })
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(res => {
                    this.props.updateLogin(res);
                    console.log('Registered successfully');
                });
            } else {
                console.log('Error registering new user');
            }
        })
        .catch(err => console.log('An error occurred: ' + err));
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
        if (this.props.show) {
            return (
                <form onSubmit={this.register} id="registerForm" className="register-form">
                Register:
                    <input className="register-input" name="firstname" value={this.state.firstname} onChange={this.handleInputChange} type="text" placeholder="First Name" required />
                    <input className="register-input" name="lastname" value={this.state.lastname} onChange={this.handleInputChange} type="text" placeholder="Last Name" required />
                    <input className="register-input" name="email" value={this.state.email} onChange={this.handleInputChange} type="text" placeholder="E-mail" required />
                    <input className="register-input" name="password" value={this.state.password} onChange={this.handleInputChange} type="password" placeholder="Password" required />
                    <button className="register-submit-button">Submit</button>
                </form>
            );
        } else {
            return null;
        }
    }
}

export default RegisterForm;