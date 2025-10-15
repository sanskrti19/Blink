import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
// Assuming you will rename Home to Dashboard as it describes the component better
import Dashboard from './pages/Dashboard'; 
// New component to protect the route
import PrivateRoute from './components/PrivateRoute'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />   
        <Route path="/signup" element={<Signup />} />  
        
        {/* Protected Route: This is where your bookmarks will be loaded */}
        <Route 
          path="/home" // Keep your chosen path /home
          element={
            <PrivateRoute>
              {/* This is the component that will fetch and display bookmarks */}
              <Dashboard /> 
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
