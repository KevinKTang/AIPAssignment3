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

    componentDidMount() {
        fetch('http://localhost:5000/ping')
            .then(res => res.json())
            .then(data => console.log(data));
    }

    render() {
        return (
            <div className="app">
                <Header />
                <Body />
                <Footer />
            </div>
        );
    }
}

export default App;