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
            password: '',
            alert: ''
        }
        this.login = this.login.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
    }

    // Send username and password to server, check if login successful
    login(event) {
        event.preventDefault();

        // Visually indicate loading to user
        document.getElementById("loginBtn").disabled = true;
        document.getElementById("loginBtn").innerHTML = 'Submitting...';

        fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        .then(res => {

            // Restore button to normal state (not loading)
            document.getElementById("loginBtn").disabled = false;
            document.getElementById("loginBtn").innerHTML = 'Submit';

            if (res.status === 200) {
                res.json().then(userFirstname => {this.props.updateLogin(true, userFirstname)});
                this.props.history.push('/');
            } else  if (res.status === 401) {
                this.setState({
                    password: '',
                    alert: 'Incorrect username or password.'
                });
            } else {
                this.setState({
                    alert: 'Error logging in.'
                });
            }
        })
        .catch(err => console.error('An error occured: ' + err));
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
            <div>
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
                            <h3 className="login-title">Login</h3>
                            <input className="form-control" name="email" value={this.state.email} onChange={this.handleInputChange} type="email" placeholder="E-mail" required />
                            <input className="form-control" name="password" value={this.state.password} onChange={this.handleInputChange} type="password" placeholder="Password" required />
                            <button id="loginBtn" className="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default LoginForm;
