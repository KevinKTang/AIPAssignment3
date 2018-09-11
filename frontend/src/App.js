import React, { Component } from 'react';
import './styles/App.css';
import Header from './Header.js';
import Body from './Body.js';
import Footer from './Footer.js';

/* 
    This is the parent component, for now it simply renders
    the header, body and footer.
*/

class App extends Component {
    constructor() {
        super();
        this.state = {
            bodyView: '',
            isLoggedIn: false
        }
        this.updateBodyView = this.updateBodyView.bind(this);
        this.updateLogin = this.updateLogin.bind(this);
    }

    updateBodyView(view) {
        this.setState({bodyView: view});
    }

    // Function for child components to update login status
    updateLogin(newIsLoggedIn) {
        this.setState({isLoggedIn: newIsLoggedIn});
    }

    render() {
        return (
            <div className="app">
                <Header updateBodyView={this.updateBodyView} updateLogin={this.updateLogin} isLoggedIn={this.state.isLoggedIn} />
                <Body bodyView={this.state.bodyView} />
                <Footer />
            </div>
        );
    }
}

export default App;