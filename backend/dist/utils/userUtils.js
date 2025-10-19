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
    const obj = user.toJSON ? user.toJSON() : user.toObject?.() ?? user;
    const provider = (0, exports.getAuthProvider)(user);
    const sanitized = {
        _id: String(obj._id),
        username: obj.username,
        email: obj.email,
        profilePicture: obj.profilePicture,
        role: obj.role,
        isActive: obj.isActive,
        isEmailVerified: obj.isEmailVerified,
        lastLogin: obj.lastLogin ? new Date(obj.lastLogin).toISOString() : null,
        createdAt: new Date(obj.createdAt).toISOString(),
        updatedAt: new Date(obj.updatedAt).toISOString(),
        provider,
    };
    return sanitized;
};
exports.sanitizeUser = sanitizeUser;
//# sourceMappingURL=userUtils.js.map