const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/crypto');
const { generateTokens } = require('../utils/jwt');
const { sanitizeUser } = require('../utils/user');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../errors');

const register = async (username, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError('An account with this email already exists');
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    passwordChangedAt: Date.now() - 1000,
  });

  const tokens = generateTokens(newUser._id);

  return {
    user: sanitizeUser(newUser),
    tokens,
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await comparePassword(password, user.password))) {
    throw new UnauthorizedError('Invalid email or password');
  }

  user.lastLogin = Date.now();
  await user.save();

  const tokens = generateTokens(user._id);

  return {
    user: sanitizeUser(user),
    tokens,
  };
};

const refreshToken = async (refreshTokenValue) => {
  const { verifyToken } = require('../utils/jwt');
  try {
    const decoded = verifyToken(refreshTokenValue, process.env.JWT_REFRESH_SECRET);
    return generateTokens(decoded.userId);
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new NotFoundError('User account not found');
  }
  return sanitizeUser(user);
};

module.exports = {
  register,
  login,
  refreshToken,
  getCurrentUser,
};

