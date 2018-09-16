import React, { Component } from 'react';
import './styles/Loading.css';

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