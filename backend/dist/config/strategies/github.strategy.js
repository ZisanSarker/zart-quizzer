"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const user_model_1 = __importDefault(require("../../models/user.model"));
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, BASE_URL, NODE_ENV } = process.env;
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !BASE_URL) {
    console.error('Missing GitHub OAuth environment variables');
    process.exit(1);
}
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/api/auth/github/callback`,
    proxy: NODE_ENV === 'production',
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        if (!profile || !profile.id)
            return done(new Error('Invalid GitHub profile'));
        const email = profile.emails?.[0]?.value;
        const githubId = profile.id;
        const username = profile.username || (email ? email.split('@')[0] : `user_${githubId}`);
        const profilePicture = profile.photos?.[0]?.value || null;
        let user = (await user_model_1.default.findOne({ githubId })) || (await user_model_1.default.findOne({ email }));
        if (user) {
            user.githubId = githubId;
            user.profilePicture = profilePicture || user.profilePicture;
            user.lastLogin = new Date();
            await user.save();
        }
        else {
            user = await user_model_1.default.create({
                username,
                email,
                githubId,
                profilePicture,
                isEmailVerified: true,
                isActive: true,
                lastLogin: new Date(),
            });
        }
        return done(null, user);
    }
    catch (error) {
        console.error(`GitHub Auth Error: ${error.message}`);
        return done(error);
    }
}));
//# sourceMappingURL=github.strategy.js.map