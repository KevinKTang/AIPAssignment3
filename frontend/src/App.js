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
            bodyContent: 'blogs'
        }
        this.updateBodyContent = this.updateBodyContent.bind(this);
    }

    updateBodyContent(view) {
        this.setState({bodyContent: view});
    }

    render() {
        return (
            <div className="app">
                <Header updateBody={this.updateBodyContent}/>
                <Body bodyContent={this.state.bodyContent}/>
                <Footer />
            </div>
        );
    }
}

export default App;