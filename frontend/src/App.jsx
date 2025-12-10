import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./components/Dashboard";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute"; // 👈 ADD THIS

function App() {
  return (
    <Router>
      <Routes>
 
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
 
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Dashboard />} />
        </Route>
 
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
