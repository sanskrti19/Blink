// App.jsx (Correct as previously defined)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup'
// ... imports for LandingPage, Home, Login, Signup

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login />} />   {/* The Login component that calls the backend */}
        <Route path="/signup" element={<Signup />} /> {/* The Signup component that calls the backend */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;