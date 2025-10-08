// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/Landing';
import Login from './components/Login.jsx'; // We'll create this next

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        
       
        <Route path="/login" element={<Login />} />
        
        
      </Routes>
    </Router>
  );
}

export default App;