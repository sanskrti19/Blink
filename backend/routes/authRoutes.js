
import express from "express";
import { register, login } from '../controllers/authController.js';
import authenticateToken from "../middleware/authMiddleware.js";
 
import mongoose from "mongoose";
import cors from "cors";  
import dotenv from "dotenv";

const router = express.Router();
 
router.post('/register', register);  
router.post('/login', login);  
 
router.get('/dashboard', authenticateToken, (req, res) => {
     
    res.json({ 
        message: `Welcome to the dashboard, ${req.user.email}!`, 
        userId: req.user.userId 
    });
});

export default router;