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

    constructor(props) {
        super();
        this.state = {
            isLoginForm: false,
            isRegisterForm: false,
            isLoggedIn: false,
            // User object as may need to add more states of a user in future
            user: {
                firstname: ''
            }
        }
        this.logout = this.logout.bind(this);
        this.userOptions = this.userOptions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    // If there is still a user session, populate the user state
    // This function produces a console 404 error if there is no current session. This may be confusing
    componentDidMount() {
        fetch('/checkSession')
            .then(res => {
                if (res.status === 200) {
                    res.json().then(res => {
                        this.setState({
                            user: {
                                firstname: res
                            },
                            isLoggedIn: true
                        });
                    })                    
                }
            })
            .catch(err => console.error('An error occurred: ' + err));
    }

    logout() {
        fetch('/logout')
            .then((res) => {
                this.setState({
                    isLoggedIn: false,
                    user: {
                        firstname: ''
                    }
                });
                console.log('Logged out successfully')
            });
    }

    // This function is called when a user logs in or registers
    // and populates the state with the user information
    updateUser(userFirstname) {
        this.setState({
            isLoginForm: false,
            isRegisterForm: false,
            isLoggedIn: true,
            user: {
                firstname: userFirstname
            }
        });
    }

    // Show selected form, allow toggle of form and close other form if open
    handleClick(event) {
        const name = event.target.name;
        let other;
        if (name === 'isLoginForm') {
            other = 'isRegisterForm';
        }
        else {
            other='isLoginForm';
        }

        if (this.state[name]) {
            this.setState({
                [name]: false
            });
        } else {
            this.setState({
                [name]: true,
                [other]: false
            });
        }
    }

    // Display user options depending on if a user is logged in or not
    userOptions() {
        if (this.state.isLoggedIn) {
            return (
                <div className="login-section">
                    <button className="view-blogs-button" onClick={() => this.props.updateBody('blogs')}>View Posts</button>
                    <button className="my-blogs-button" onClick={() => this.props.updateBody('myblogs')}>My Posts</button>
                    <button className="create-blog-button" onClick={() => this.props.updateBody('createBlog')}>New Post</button>
                    <button className="logout-button" onClick={this.logout}>Logout</button>
                </div>
            )
        } else {
            return (
                <div className="login-section">
                    <button className="login-button" name="isLoginForm" onClick={this.handleClick}>Login</button>
                    <button className="register-button" name="isRegisterForm" onClick={this.handleClick}>Register</button>
                    <LoginForm show={this.state.isLoginForm} updateLogin={this.updateUser} />
                    <RegisterForm show={this.state.isRegisterForm} updateLogin={this.updateUser}/>
                </div>
            )
        }
    }
    
    render() {
        return (
            <div className="header">
                <div className="header-text">
                    <div>Off With His Read</div>
                    {this.state.isLoggedIn ? (<div className="welcome-text">Welcome, {this.state.user.firstname}.</div>) : ('')}
                </div>
                {this.userOptions()}
            </div>
        )
    }
}

export default Header;