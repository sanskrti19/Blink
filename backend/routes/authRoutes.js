// routes/authRoutes.js
import express from "express";
import { register, login } from '../controllers/authController.js';
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (no token required)
router.post('/register', register); // POST /api/auth/register
router.post('/login', login);     // POST /api/auth/login

// Example of a Protected Route (token required)
router.get('/dashboard', authenticateToken, (req, res) => {
    // req.user is available here due to authenticateToken middleware
    res.json({ 
        message: `Welcome to the dashboard, ${req.user.email}!`, 
        userId: req.user.userId 
    });
});

export default router;