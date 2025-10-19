"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAccount = exports.changePassword = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const profile_model_1 = __importDefault(require("../models/profile.model"));
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
const quizAttempt_model_1 = __importDefault(require("../models/quizAttempt.model"));
const quizRating_model_1 = __importDefault(require("../models/quizRating.model"));
const savedQuiz_model_1 = __importDefault(require("../models/savedQuiz.model"));
const statistics_model_1 = __importDefault(require("../models/statistics.model"));
const userUtils_1 = require("../utils/userUtils");
const validatePasswordChange = (currentPassword, newPassword, confirmPassword) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        return { valid: false, message: 'Please provide current and new passwords' };
    }
    if (newPassword !== confirmPassword) {
        return { valid: false, message: 'New passwords do not match' };
    }
    if (newPassword.length < 8) {
        return { valid: false, message: 'New password must be at least 8 characters long' };
    }
    if (!/\d/.test(newPassword)) {
        return { valid: false, message: 'New password must include at least one number' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        return { valid: false, message: 'New password must include at least one special character' };
    }
    return { valid: true };
};
const deleteUserData = async (userId) => {
    await Promise.all([
        profile_model_1.default.deleteMany({ userId }),
        quiz_model_1.default.deleteMany({ createdBy: userId }),
        quizAttempt_model_1.default.deleteMany({ userId }),
        quizRating_model_1.default.deleteMany({ userId }),
        savedQuiz_model_1.default.deleteMany({ userId }),
        statistics_model_1.default.deleteMany({ userId })
    ]);
};
const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const validation = validatePasswordChange(currentPassword, newPassword, confirmPassword);
        if (!validation.valid) {
            res.status(400).json({ message: validation.message });
            return;
        }
        const user = await user_model_1.default.findById(userId).select('+password');
        if (!user) {
            res.status(404).json({ message: 'User account not found' });
            return;
        }
        const isMatch = await (0, userUtils_1.comparePassword)(currentPassword, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Current password is incorrect' });
            return;
        }
        const hashedNewPassword = await (0, userUtils_1.hashPassword)(newPassword);
        user.password = hashedNewPassword;
        user.passwordChangedAt = new Date(Date.now() - 1000);
        await user.save();
        console.log(`[SETTINGS] Password changed for user: ${userId}`);
        res.status(200).json({ message: 'Password changed successfully' });
        return;
    }
    catch (error) {
        console.error(`[SETTINGS] Change password error: ${error.message}`);
        res.status(500).json({ message: 'Unable to change password. Please try again.' });
        return;
    }
};
exports.changePassword = changePassword;
const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User account not found' });
            return;
        }
        await deleteUserData(userId);
        await user_model_1.default.findByIdAndDelete(userId);
        console.log(`[SETTINGS] Account deleted for user: ${userId}`);
        res.status(200).json({ message: 'Account and all data deleted successfully' });
        return;
    }
    catch (error) {
        console.error(`[SETTINGS] Delete account error: ${error.message}`);
        res.status(500).json({ message: 'Unable to delete account. Please try again.' });
        return;
    }
};
exports.deleteUserAccount = deleteUserAccount;
//# sourceMappingURL=settings.controller.js.map