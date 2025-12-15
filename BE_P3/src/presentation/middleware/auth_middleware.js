const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token not found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = {
            id: decoded.sub,
            role: decoded.role
        };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

const requireRole = (role) => (req, res, next) => {
    console.log("----------------DEBUG ROLE----------------");
        console.log("1. Role yêu cầu (allowedRoles):", role);
        console.log("2. User trong Token (req.user):", req.user);
        console.log("3. Role của User:", req.user?.role); 
        console.log("------------------------------------------");
    if (!req.user || req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }
    next();
};

module.exports = { verifyToken, requireRole };