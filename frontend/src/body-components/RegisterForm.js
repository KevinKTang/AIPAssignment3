import React, { Component } from 'react';
import '../styles/RegisterForm.css';

/*
    This component contains the register form used to
    create an account for the website
*/

class RegisterForm extends Component {
    constructor(props) {
        super();
        this.state = {
            isLoading: false,
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            alert: ''
        }
        this.register = this.register.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
    }

    componentDidMount() {
        // Focus on first form input box
        this._input.focus();
    }

    register(event) {
        event.preventDefault();

        // Visually indicate loading on submit button to user
        this.setState({
            isLoading: true
        });

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

            // Restore button to normal state (not loading)
            this.setState({
                isLoading: false
            });

            if (res.status === 200) {
                res.json().then(user => {
                    this.props.updateLogin(true, user);
                    this.props.history.push('/');
                });
            } else if (res.status === 409) {
                this.setState({
                    alert: 'An account with that email address is already taken. Try using a different email address.'
                });
            }
            else if (res.status === 400) {
                    res.json().then(res => {
                        this.setState({
                            alert: res.alert
                        });
                    });
            } else {
                this.setState({
                    alert: 'Error registering new user.'
                });
            }
        })
        .catch(err => {
            console.error('An error occurred: ' + err);
            // Restore button to normal state (not loading)
            this.setState({
                isLoading: false
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
                {/* Alert for incorrect register */}
                {this.state.alert ? (
                    <div className="alert alert-danger alert-dismissible">
                        {this.state.alert}
                        <button type="button" onClick={this.dismissAlert} className="close">&times;</button>
                    </div>
                ) : ('')}

                {/* Register form */}
                <form onSubmit={this.register} id="registerForm">
                    <div className="container">
                        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                            <h3 className="register-title">Register</h3>
                            <input ref={c => this._input = c} className="form-control" name="firstname" value={this.state.firstname} onChange={this.handleInputChange} type="text" placeholder="First Name" required />
                            <input className="form-control" name="lastname" value={this.state.lastname} onChange={this.handleInputChange} type="text" placeholder="Last Name" required />
                            <input className="form-control" name="email" value={this.state.email} onChange={this.handleInputChange} type="email" placeholder="E-mail" required />
                            <input className="form-control" name="password" value={this.state.password} onChange={this.handleInputChange} type="password" placeholder="Password" required />
                            <button disabled={this.state.isLoading} className="btn btn-lg btn-primary btn-block" type="submit">{this.state.isLoading ? ('Submitting...') : ('Submit')}</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default RegisterForm;
