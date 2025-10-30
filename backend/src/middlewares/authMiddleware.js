const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { generateTokens } = require('../utils/jwt');
const { UnauthorizedError } = require('../errors');

const authMiddleware = async (req, res, next) => {
  try {
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.userId = req.user._id || req.user.id;
      return next();
    }

    const accessToken = req.cookies.accessToken;
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.split(' ')[1];
    const token = accessToken || headerToken;

    if (!token) {
      throw new UnauthorizedError('Access denied. No token provided.');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.userId = decoded.userId;
      const user = await User.findById(decoded.userId);
      if (!user) throw new UnauthorizedError('User not found');
      req.user = user;
      return next();
    } catch (tokenError) {
      const refreshTokenCookie = req.cookies.refreshToken;
      const refreshTokenHeader = authHeader?.split(' ')[2];
      const refreshToken = refreshTokenHeader || refreshTokenCookie;

      if (!refreshToken) {
        throw new UnauthorizedError('Refresh token required.');
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        req.userId = decodedRefresh.userId;
        const user = await User.findById(decodedRefresh.userId);
        if (!user) throw new UnauthorizedError('User not found');
        req.user = user;

        const newAccessToken = jwt.sign({ userId: req.userId }, process.env.JWT_ACCESS_SECRET, {
          expiresIn: '15m',
        });

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 15 * 60 * 1000,
        });

        return next();
      } catch (refreshTokenError) {
        throw new UnauthorizedError('Invalid refresh token. Authentication required.');
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;

