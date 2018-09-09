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
            bodyView: ''
        }
        this.updateBodyView = this.updateBodyView.bind(this);
    }

    updateBodyView(view) {
        this.setState({bodyView: view});
    }

    render() {
        return (
            <div className="app">
                <Header updateBody={this.updateBodyView}/>
                <Body bodyView={this.state.bodyView}/>
                <Footer />
            </div>
        );
    }
}

export default App;