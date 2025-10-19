"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUser = exports.getAuthProvider = exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = async (password) => {
    return await bcryptjs_1.default.hash(password, 10);
};
exports.hashPassword = hashPassword;
const comparePassword = async (candidatePassword, hashedPassword) => {
    return await bcryptjs_1.default.compare(candidatePassword, hashedPassword);
};
exports.comparePassword = comparePassword;
const getAuthProvider = (user) => {
    if (user.googleId)
        return 'google';
    if (user.githubId)
        return 'github';
    return 'local';
};
exports.getAuthProvider = getAuthProvider;
const sanitizeUser = (user) => {
    const userObj = user.toJSON ? user.toJSON() : user.toObject();
    delete userObj.password;
    delete userObj.passwordChangedAt;
    delete userObj.passwordResetToken;
    delete userObj.passwordResetExpires;
    delete userObj.__v;
    return userObj;
};
exports.sanitizeUser = sanitizeUser;
//# sourceMappingURL=userUtils.js.map