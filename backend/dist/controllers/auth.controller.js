"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGithubCallback = exports.startGithubAuth = exports.handleGoogleCallback = exports.startGoogleAuth = exports.getCurrentUser = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generateTokens_1 = __importDefault(require("../utils/generateTokens"));
const userUtils_1 = require("../utils/userUtils");
const validator_1 = __importDefault(require("validator"));
const passport_1 = __importDefault(require("../config/passport"));
const cookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
    maxAge,
    path: '/',
});
const validateRegistration = (username, email, password) => {
    if (!username || !email || !password) {
        return { valid: false, message: 'Please fill in all required fields' };
    }
    if (!validator_1.default.isEmail(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/\d/.test(password)) {
        return { valid: false, message: 'Password must include at least one number' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: 'Password must include at least one special character' };
    }
    return { valid: true };
};
const validateLogin = (email, password) => {
    if (!email || !password) {
        return { valid: false, message: 'Please enter both email and password' };
    }
    if (!validator_1.default.isEmail(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    return { valid: true };
};
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const validation = validateRegistration(username, email, password);
        if (!validation.valid) {
            res.status(400).json({ message: validation.message });
            return;
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'An account with this email already exists' });
            return;
        }
        const hashedPassword = await (0, userUtils_1.hashPassword)(password);
        const newUser = await user_model_1.default.create({
            username,
            email,
            password: hashedPassword,
            passwordChangedAt: new Date(Date.now() - 1000)
        });
        const { accessToken, refreshToken } = (0, generateTokens_1.default)(newUser._id);
        res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
        res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
        console.log(`[AUTH] User registered: ${email} (ID: ${newUser._id})`);
        res.status(201).json({
            message: 'Account created successfully! Welcome aboard!',
            user: (0, userUtils_1.sanitizeUser)(newUser),
            accessToken,
            refreshToken
        });
        return;
    }
    catch (error) {
        console.error(`[AUTH] Registration error: ${error.message}`);
        res.status(500).json({ message: 'Unable to create account. Please try again.' });
        return;
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validation = validateLogin(email, password);
        if (!validation.valid) {
            res.status(400).json({ message: validation.message });
            return;
        }
        const user = await user_model_1.default.findOne({ email }).select('+password');
        if (!user || !(await (0, userUtils_1.comparePassword)(password, user.password))) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        user.lastLogin = new Date();
        await user.save();
        const { accessToken, refreshToken } = (0, generateTokens_1.default)(user._id);
        res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
        res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
        console.log(`[AUTH] User logged in: ${email} (ID: ${user._id})`);
        res.status(200).json({
            message: 'Welcome back! You have been logged in successfully.',
            user: (0, userUtils_1.sanitizeUser)(user),
            accessToken,
            refreshToken
        });
        return;
    }
    catch (error) {
        console.error(`[AUTH] Login error: ${error.message}`);
        res.status(500).json({ message: 'Unable to log in. Please try again.' });
        return;
    }
};
exports.login = login;
const logout = (req, res) => {
    try {
        const clearOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
        };
        res.clearCookie('accessToken', clearOptions);
        res.clearCookie('refreshToken', clearOptions);
        req.logout((error) => {
            if (error) {
                console.error(`[AUTH] Logout error: ${error.message}`);
                res.status(500).json({ message: 'Unable to log out. Please try again.' });
                return;
            }
            const userInfo = req.user?.email || req.userId || 'anonymous';
            console.log(`[AUTH] User logged out: ${userInfo}`);
            res.status(200).json({ message: 'You have been logged out successfully.' });
            return;
        });
    }
    catch (error) {
        console.error(`[AUTH] Logout error: ${error.message}`);
        res.status(500).json({ message: 'Unable to log out. Please try again.' });
        return;
    }
};
exports.logout = logout;
const refreshToken = (req, res) => {
    try {
        const refreshTokenFromClient = req.cookies?.refreshToken;
        if (!refreshTokenFromClient) {
            res.status(403).json({ message: 'Session expired. Please log in again.' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(refreshTokenFromClient, process.env.JWT_REFRESH_SECRET);
        const { accessToken, refreshToken } = (0, generateTokens_1.default)(decoded.userId);
        res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
        res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
        console.log(`[AUTH] Tokens refreshed for user: ${decoded.userId}`);
        res.status(200).json({ message: 'Session refreshed successfully.' });
        return;
    }
    catch (error) {
        console.error(`[AUTH] Token refresh error: ${error.message}`);
        res.status(403).json({ message: 'Session expired. Please log in again.' });
        return;
    }
};
exports.refreshToken = refreshToken;
const getCurrentUser = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User account not found.' });
            return;
        }
        res.status(200).json({ user });
        return;
    }
    catch (error) {
        console.error(`[AUTH] Get current user error: ${error.message}`);
        res.status(500).json({ message: 'Unable to retrieve user information.' });
        return;
    }
};
exports.getCurrentUser = getCurrentUser;
exports.startGoogleAuth = passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
});
exports.handleGoogleCallback = [
    passport_1.default.authenticate('google', {
        failureRedirect: '/login',
    }),
    async (req, res) => {
        try {
            const user = req.user;
            user.lastLogin = new Date();
            await user.save();
            const { accessToken, refreshToken } = (0, generateTokens_1.default)(user._id);
            res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
            res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
            console.log(`[AUTH] Google OAuth login: ${user.email} (ID: ${user._id})`);
            const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`;
            res.redirect(redirectUrl);
        }
        catch (error) {
            console.error(`[AUTH] Google OAuth error: ${error.message}`);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
        }
    }
];
exports.startGithubAuth = passport_1.default.authenticate('github', {
    scope: ['user:email'],
});
exports.handleGithubCallback = [
    passport_1.default.authenticate('github', {
        failureRedirect: '/login',
    }),
    async (req, res) => {
        try {
            const user = req.user;
            user.lastLogin = new Date();
            await user.save();
            const { accessToken, refreshToken } = (0, generateTokens_1.default)(user._id);
            res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
            res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
            console.log(`[AUTH] GitHub OAuth login: ${user.email} (ID: ${user._id})`);
            const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`;
            res.redirect(redirectUrl);
        }
        catch (error) {
            console.error(`[AUTH] GitHub OAuth error: ${error.message}`);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
        }
    },
];
//# sourceMappingURL=auth.controller.js.map