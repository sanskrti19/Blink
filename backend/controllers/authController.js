 
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();  
 
const createJWT = (user) => {
     
    return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' } 
    );
};
 
export const register = async (req, res) => {
     
    const { name, email, password } = req.body; 
 
    if (!name || !email || !password) {
        
        return res.status(400).json({ msg: 'Please provide name, email, and password' }); 
    }

    try {
      
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'User already exists' });
        }
 
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);
 
        const user = await User.create({ name, email, password: hashedPassword }); 
     
        const token = createJWT(user);
       
        res.status(201).json({ user: { name: user.name, email: user.email }, token }); 

    } catch (error) {
    
        console.error("Registration failed:", error); 
        res.status(500).json({ msg: 'Registration failed', error: error.message });
    }
};
 
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' });
    }

    try {
       
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
 
        const token = createJWT(user);
        res.status(200).json({ user: { email: user.email }, token });

    } catch (error) {
        res.status(500).json({ msg: 'Login failed', error: error.message });
    }
};