const authService = require('../services/authService');
const { validateRegistration, validateLogin } = require('../validators/auth');
const passport = require('../config/passport');
const { generateTokens } = require('../utils/jwt');

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge,
  path: '/',
});

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    validateRegistration(username, email, password);

    const { user, tokens } = await authService.register(username, email, password);

    res.cookie('accessToken', tokens.accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

    res.status(201).json({
      message: 'Account created successfully! Welcome aboard!',
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    validateLogin(email, password);

    const { user, tokens } = await authService.login(email, password);

    res.cookie('accessToken', tokens.accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

    res.status(200).json({
      message: 'Welcome back! You have been logged in successfully.',
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'You have been logged out successfully.' });
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshTokenFromClient = req.cookies.refreshToken;

    if (!refreshTokenFromClient) {
      return res.status(403).json({ message: 'Session expired. Please log in again.' });
    }

    const tokens = await authService.refreshToken(refreshTokenFromClient);

    res.cookie('accessToken', tokens.accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

    res.status(200).json({ message: 'Session refreshed successfully.' });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const startGoogleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
});

const handleGoogleCallback = [
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  async (req, res, next) => {
    try {
      const user = req.user;
      user.lastLogin = Date.now();
      await user.save();

      const tokens = generateTokens(user._id);
      res.cookie('accessToken', tokens.accessToken, cookieOptions(15 * 60 * 1000));
      res.cookie('refreshToken', tokens.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

      const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  },
];

const startGithubAuth = passport.authenticate('github', {
  scope: ['user:email'],
  session: false
});

const handleGithubCallback = [
  passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
  }),
  async (req, res, next) => {
    try {
      const user = req.user;
      user.lastLogin = Date.now();
      await user.save();

      const tokens = generateTokens(user._id);
      res.cookie('accessToken', tokens.accessToken, cookieOptions(15 * 60 * 1000));
      res.cookie('refreshToken', tokens.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

      const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  },
];

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  startGoogleAuth,
  handleGoogleCallback,
  startGithubAuth,
  handleGithubCallback,
};

