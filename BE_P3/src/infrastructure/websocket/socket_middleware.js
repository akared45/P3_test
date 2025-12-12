const jwt = require('jsonwebtoken');
require('dotenv').config();

const socketAuthMiddleWare = (socket, next) => {
    const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
        return next(new Error("Authentication error: Token missing"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        socket.data.user = {
            id: decoded.sub,
            role: decoded.role
        };

        // console.log(`Socket authenticated: ${decoded.sub}`);
        next();
    } catch (err) {
        console.log(`Socket connection rejected: Invalid token`);
        return next(new Error("Authentication error: Invalid or expired token"));
    }
};

module.exports = socketAuthMiddleWare;