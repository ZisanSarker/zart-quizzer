import passport from 'passport';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { VerifyCallback } from 'passport-oauth2';
import User from '../../models/user.model';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, BASE_URL, NODE_ENV } = process.env;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !BASE_URL) {
  console.error('Missing GitHub OAuth environment variables');
  process.exit(1);
}

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/auth/github/callback`,
      proxy: NODE_ENV === 'production',
    },
    async (_accessToken: string, _refreshToken: string, profile: GitHubProfile, done: VerifyCallback) => {
      try {
  if (!profile || !profile.id) return done(new Error('Invalid GitHub profile'));
        
        const email = profile.emails?.[0]?.value as string | undefined;
        const githubId = profile.id as string;
        const username = (profile.username as string) || (email ? email.split('@')[0] : `user_${githubId}`);
        const profilePicture = profile.photos?.[0]?.value || null;

        let user = (await User.findOne({ githubId })) || (await User.findOne({ email }));

        if (user) {
          user.githubId = githubId;
          user.profilePicture = profilePicture || user.profilePicture;
          user.lastLogin = new Date();
          await user.save();
        } else {
          user = await User.create({
            username,
            email,
            githubId,
            profilePicture,
            isEmailVerified: true,
            isActive: true,
            lastLogin: new Date(),
          });
        }

        return done(null, user as any);
      } catch (error: any) {
        console.error(`GitHub Auth Error: ${error.message}`);
        return done(error);
      }
    }
  )
);
