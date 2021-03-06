import React, { Component } from 'react';
import { LOGIN } from '../constants/ErrorMessages.js';
import '../styles/LoginForm.css';

/*
    The LoginForm component contains the login form used to
    enter the website, which is simply required an email and password.
*/

class LoginForm extends Component {
    constructor(props) {
        super();
        this.state = {
            isLoading: false,
            email: '',
            password: '',
            alert: ''
        }
        this.login = this.login.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
    }

    componentDidMount() {
        // Focus on first form input box (email)
        this._input.focus();
    }

    login(event) {
        event.preventDefault();

        // Visually indicate loading on submit button to user
        this.setState({
            isLoading: true
        });

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
                res.json().then(user => {this.props.updateLogin(true, user)});
                this.props.history.push('/');
            } else {

                // Restore button to normal state (not loading)
                this.setState({
                    isLoading: false
                });

                if (res.status === 401) {
                    this.setState({
                        password: '',
                        alert: LOGIN.incorrectLogin
                    });
                } else {
                    this.setState({
                        alert: LOGIN.genericError
                    });
                }
            } 
        })
        .catch(err => {
            // Restore button to normal state (not loading)
            this.setState({
                isLoading: false,
                alert: LOGIN.errorOccurred + err
            });
        });
    }

    dismissAlert() {
        this.setState({
            alert: ''
        });
    }

    // Update the state to reflect user input
    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value,
            // Hide alert when user changes input
            alert: ''
        });
    }

    render() {
        return (
            <div className="text-center">
                {/* Alert for incorrect login */}
                {this.state.alert ? (
                    <div className="alert alert-danger alert-dismissible">
                        {this.state.alert}
                        <button type="button" onClick={this.dismissAlert} className="close">&times;</button>
                    </div>
                ) : ('')}
                
                {/* Login form */}
                <form onSubmit={this.login}>
                    <div className="container">
                        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                            <h1 className="login-title">Login</h1>
                            <input ref={c => this._input = c} className="form-control" name="email" value={this.state.email} onChange={this.handleInputChange} type="email" placeholder="E-mail" required />
                            <input className="form-control" name="password" value={this.state.password} onChange={this.handleInputChange} type="password" placeholder="Password" required />
                            <button disabled={this.state.isLoading} className="btn btn-lg btn-primary btn-block" type="submit">{this.state.isLoading ? ('Submitting...') : ('Submit')}</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default LoginForm;
