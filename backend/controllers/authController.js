import User from '../models/User.js'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
    
    return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: '1d',  
    });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
    
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials: User not found.' });
        }
 
        const isMatch = await user.matchPassword(password); 

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentials: Password incorrect.' });
        }
 
        res.json({
         
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),  
        });

    } catch (error) {
        console.error("Login Server Error:", error);
       
        res.status(500).json({ message: 'Server error during login process.', error: error.message });
    }
};
 
export const registerUser = async (req, res) => {
   
    const { name, email, password } = req.body; 

    try {
        
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
           
            res.status(201).json({
                _id: user._id,
                email: user.email,
                name: user.name,
                token: generateToken(user._id),
            });
        } else {
           
            res.status(400).json({ message: 'Invalid user data provided.' });
        }

    } catch (error) {
       
        console.error('Registration Server Error:', error);
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};
