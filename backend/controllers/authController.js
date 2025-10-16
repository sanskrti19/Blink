import User from '../models/User.js'; // Ensure you have this model
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
    // 🚨 CRITICAL FIX: The expiresIn property was corrupted in the file. Correcting it now.
    return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
    });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check for user existence
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials: User not found.' });
        }

        // 2. Check password
        // Assuming your User model has a matchPassword method using bcrypt
        const isMatch = await user.matchPassword(password); 

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentials: Password incorrect.' });
        }

        // 3. Success: Return JWT token
        res.json({
            // Send back the user's ID and email for convenience
            _id: user._id,
            email: user.email,
            token: generateToken(user._id), // Generate and send the token
        });

    } catch (error) {
        console.error("Login Server Error:", error);
        // CRITICAL: Always return JSON for server errors
        res.status(500).json({ message: 'Server error during login process.', error: error.message });
    }
};

/**
 * Handles new user registration (POST /api/auth/register)
 */
export const registerUser = async (req, res) => {
    // Assuming the frontend sends name, email, and password
    const { name, email, password } = req.body; 

    try {
        // 1. Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        // 2. Create and Save the user (Password hashing happens automatically via Mongoose middleware)
        const user = await User.create({ name, email, password });

        if (user) {
            // 3. Success: Send the user data and the JWT token
            res.status(201).json({
                _id: user._id,
                email: user.email,
                name: user.name,
                token: generateToken(user._id),
            });
        } else {
            // Fallback error if user creation failed validation/data checks
            res.status(400).json({ message: 'Invalid user data provided.' });
        }

    } catch (error) {
        // Mongoose validation errors or other server errors
        console.error('Registration Server Error:', error);
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};
