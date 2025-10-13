 

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; 
import './index.css';  

// Find the root DOM element and render the App component inside StrictMode
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);