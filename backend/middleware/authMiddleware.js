import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Format is "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) return res.status(401).json({ message: "Access denied. No token provided." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token." }); // Forbidden
        
        // Attach the decoded user payload to the request
        req.user = user; 
        next();
    });
}

 export default authenticateToken;