import 'dotenv/config';
import passport from 'passport';
import User from '../models/user.model';

import './strategies/google.strategy';
import './strategies/github.strategy';

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err as any, null);
  }
});

export default passport;
