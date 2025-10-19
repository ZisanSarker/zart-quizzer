"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const authMiddleware = async (req, res, next) => {
    try {
        if (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) {
            req.userId = req.user?._id?.toString() || req.user?.id;
            return next();
        }
        const accessToken = req.cookies?.accessToken;
        const authHeader = req.headers.authorization;
        const headerToken = authHeader?.split(' ')[1];
        const token = accessToken || headerToken;
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
            req.userId = decoded.userId;
            const user = await user_model_1.default.findById(decoded.userId);
            if (!user)
                return res.status(401).json({ message: 'User not found' });
            req.user = user;
            return next();
        }
        catch (_tokenError) {
            const refreshTokenCookie = req.cookies?.refreshToken;
            const refreshTokenHeader = authHeader?.split(' ')[2];
            const refreshToken = refreshTokenHeader || refreshTokenCookie;
            if (!refreshToken) {
                return res.status(403).json({ message: 'Refresh token required.' });
            }
            try {
                const decodedRefresh = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                req.userId = decodedRefresh.userId;
                const user = await user_model_1.default.findById(decodedRefresh.userId);
                if (!user)
                    return res.status(401).json({ message: 'User not found' });
                req.user = user;
                const newAccessToken = jsonwebtoken_1.default.sign({ userId: req.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000,
                });
                return next();
            }
            catch (_refreshTokenError) {
                return res.status(403).json({ message: 'Invalid refresh token. Authentication required.' });
            }
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map