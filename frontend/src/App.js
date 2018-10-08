import React, { Component } from 'react';
import './styles/App.css';
import Header from './Header.js';
import Body from './Body.js';

/* 
    This is the parent component which renders
    the header and body.
*/

class App extends Component {
    constructor() {
        super();
        this.state = {
            bodyView: '',
            isLoggedIn: false,
            userFirstname: ''
        }
        this.updateLogin = this.updateLogin.bind(this);
    }

    // If there is still a user session, populate the user state
    // This function produces a console 404 error if there is no current session. This may be confusing
    componentDidMount() {
        fetch('/checkSession')
            .then(res => {
                if (res.status === 200) {
                    res.json().then(firstname => {
                        this.setState({
                            isLoggedIn: true,
                            userFirstname: firstname
                        });
                    });
                }
            })
            .catch(err => console.error('An error occurred: ' + err));
    }

    // Function for child components to update login status
    updateLogin(newIsLoggedIn, userFirstname) {
        if (newIsLoggedIn) {
            this.setState({
                isLoggedIn: newIsLoggedIn,
                userFirstname: userFirstname
            });
        } else {
            this.setState({isLoggedIn: newIsLoggedIn});
        }
    }
    // Simply renders the header and body
    render() {
        return (
            <div className="app">
                <Header isLoggedIn={this.state.isLoggedIn} updateLogin={this.updateLogin} userFirstname={this.state.userFirstname} />
                <Body isLoggedIn={this.state.isLoggedIn} updateLogin={this.updateLogin} />
            </div>
        );
    }
}

export default App;
