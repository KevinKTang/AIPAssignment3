import React, { Component } from 'react';
import './styles/Loading.css';

/*
    An animated loading icon
*/

class Loading extends Component {
    render() {
        return (
            <div className="loading-outer">
                <div className="loading-inner"></div>
            </div>
        )
    }
}

export default Loading;