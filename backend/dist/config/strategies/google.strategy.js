"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = __importDefault(require("../../models/user.model"));
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL, NODE_ENV } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !BASE_URL) {
    console.error('Missing Google OAuth environment variables');
    process.exit(1);
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/api/auth/google/callback`,
    proxy: NODE_ENV === 'production',
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        if (!profile || !profile.id)
            return done(new Error('Invalid Google profile'));
        const email = profile.emails?.[0]?.value;
        if (!email)
            return done(new Error('Email not provided'));
        const googleId = profile.id;
        const username = profile.displayName || email.split('@')[0];
        const profilePicture = profile.photos?.[0]?.value || null;
        let user = (await user_model_1.default.findOne({ googleId })) || (await user_model_1.default.findOne({ email }));
        if (user) {
            user.googleId = googleId;
            user.profilePicture = profilePicture || user.profilePicture;
            user.lastLogin = new Date();
            await user.save();
        }
        else {
            user = await user_model_1.default.create({
                username,
                email,
                googleId,
                profilePicture,
                isEmailVerified: true,
                isActive: true,
                lastLogin: new Date(),
            });
        }
        return done(null, user);
    }
    catch (error) {
        console.error(`Google Auth Error: ${error.message}`);
        return done(error);
    }
}));
//# sourceMappingURL=google.strategy.js.map