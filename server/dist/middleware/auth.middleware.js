"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access token is required' });
        }
        const payload = (0, jwt_util_1.verifyToken)(token);
        if (!payload) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.userId = payload.userId;
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.authenticate = authenticate;
