import React from 'react';
import './style.css';

function Loading() {
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
}

export default Loading;