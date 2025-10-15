import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Checks if a JWT token exists in localStorage.
 * If yes, renders the children (the protected component).
 * If no, redirects to the /login page.
 */
const PrivateRoute = ({ children }) => {
    // We check for the presence of the JWT token
    const isAuthenticated = localStorage.getItem('token');

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
