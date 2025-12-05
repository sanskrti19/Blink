// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default function authenticateToken(req, res, next) {
  try {
    if (!SECRET) {
      console.error('FATAL ERROR: JWT_SECRET not loaded in middleware.');
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token synchronously via callback (as you had) but correctly use the decoded payload
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        console.warn('JWT verify error:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
      }

      // decoded is the payload object you issued at login. Common shapes: { id, userId, _id, email }
      // Normalize to a stable shape on req.user
      const userId = decoded.id || decoded.userId || decoded._id;
      if (!userId) {
        console.warn('JWT payload missing id/userId:', decoded);
        return res.status(401).json({ message: 'Invalid token payload.' });
      }

      // attach consistent shape
      req.user = { userId };
      // optional: attach whole payload too if you need additional fields
      req.user.payload = decoded;

      next();
    });
  } catch (err) {
    console.error('auth middleware unexpected error:', err);
    return res.status(500).json({ message: 'Auth middleware error' });
  }
}
