
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import LandingPage from './pages/Landing'; 
import Home from './components/Home'; 

import Login from './pages/Login.jsx'; 


// import Signup from './pages/Signup.jsx';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={<Login />} />
        
        <Route path="/home" element={<Home />} />
{/* 
        <Route path="/signup" element={<Signup/>}/> */}
        
      </Routes>
    </Router>
  );
}

export default App;