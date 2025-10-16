import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser); // Maps POST /api/auth/login to loginUser
router.post('/register', registerUser); // Maps POST /api/auth/register to registerUser

export default router;
