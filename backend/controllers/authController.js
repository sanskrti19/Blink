// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Ensure env variables are loaded here too

// --- JWT HELPER FUNCTION ---
const createJWT = (user) => {
    // The payload data that will be stored in the token
    return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' } // Token is valid for 30 days
    );
};
// ----------------------------

// 1. REGISTER LOGIC
export const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // HASH THE PASSWORD
        const salt = await bcrypt.genSalt(10); // Generates a salt for security
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user with the HASHED password
        const user = await User.create({ email, password: hashedPassword });

        // Generate token and send back
        const token = createJWT(user);
        res.status(201).json({ user: { email: user.email }, token });

    } catch (error) {
        // Handle validation errors (e.g., email format)
        res.status(500).json({ msg: 'Registration failed', error: error.message });
    }
};

// 2. LOGIN LOGIC
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' });
    }

    try {
        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }

        // 2. COMPARE PASSWORD (BCRYPT)
        // Uses the stored hash to check if the provided password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }

        // 3. Generate token and send back
        const token = createJWT(user);
        res.status(200).json({ user: { email: user.email }, token });

    } catch (error) {
        res.status(500).json({ msg: 'Login failed', error: error.message });
    }
};