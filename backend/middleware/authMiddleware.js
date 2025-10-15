 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';  
 
dotenv.config(); 
 
const SECRET = process.env.JWT_SECRET; 

function authenticateToken(req, res, next) {
   
    if (!SECRET) {
        console.error("FATAL ERROR: JWT_SECRET not loaded in middleware.");
        
        return res.status(500).json({ message: "Server configuration error." });
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
       
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

     
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
          
            return res.status(403).json({ message: "Invalid or expired token." }); 
        }

        req.user = user;  
        next();
    });
}

export default authenticateToken;