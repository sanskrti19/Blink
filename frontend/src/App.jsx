import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
 
import Dashboard from './components/Dashboard'; 
 
import PrivateRoute from './components/PrivateRoute'; 

function App() {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />   
        <Route path="/signup" element={<Signup />} />  
        
         
        <Route 
          path="/home"  
          element={
            <PrivateRoute>
              
              <Dashboard /> 
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
