// src/App.jsx (CORRECTED)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🛑 FIX 1: Must import 'LandingPage' not 'Landing' to match file name.
// Assuming the file is located at './pages/LandingPage.jsx'
import LandingPage from './pages/Landing'; 

// 🛑 FIX 2: Assuming Login is in the 'pages' directory, adjust path.
// Assuming the file is located at './pages/Login.jsx'
import Login from './components/Login.jsx'; 

// NEW: Add the necessary Home component for post-login redirection
import Home from './components/Home'; 

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Landing Page: Root Path */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login Page: Separate Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Home/Dashboard Route */}
        <Route path="/home" element={<Home />} />
        
      </Routes>
    </Router>
  );
}

export default App;