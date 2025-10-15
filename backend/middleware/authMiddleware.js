// middleware/authMiddleware.js (or wherever you put this file)

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; // Import dotenv to ensure access if running standalone

// It's safer to ensure env variables are loaded in the module where they are used.
// However, if server.js loads them first, this may be redundant.
dotenv.config(); 

// Correct way: Access the secret from the environment ONLY.
const SECRET = process.env.JWT_SECRET; 

function authenticateToken(req, res, next) {
    // 1. Check if the secret is loaded (for debugging)
    if (!SECRET) {
        console.error("FATAL ERROR: JWT_SECRET not loaded in middleware.");
        // This should never happen if your server.js is configured correctly
        return res.status(500).json({ message: "Server configuration error." });
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        // No token provided
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2. Use the environment secret for verification
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            // Token is invalid, expired, or tampered with
            return res.status(403).json({ message: "Invalid or expired token." }); 
        }

        req.user = user; // Attach user data to the request
        next();
    });
}

export default authenticateToken;