import React, { Component } from 'react';
import '../styles/LoginForm.css';

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
            <form onSubmit={this.login}>
              <div className="container">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                 <h3 className="login-title">Login</h3>
                    <input className="form-control" name="email" value={this.state.email} onChange={this.handleInputChange} type="email" placeholder="E-mail" required />
                    <input className="form-control" name="password" value={this.state.password} onChange={this.handleInputChange} type="password" placeholder="Password" required />
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
                </div>
              </div>
            </form>

        );
    }

}

export default LoginForm;
