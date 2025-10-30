const { User, Profile, Quiz, QuizAttempt, QuizRating, SavedQuiz, Statistics, QuizPrompt } = require('../models');
const { hashPassword, comparePassword } = require('../utils/crypto');
const { NotFoundError, UnauthorizedError } = require('../errors');

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new NotFoundError('User account not found');
  }

  if (!user.password) {
    throw new UnauthorizedError('Password authentication not available for this account');
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  const hashedNewPassword = await hashPassword(newPassword);
  user.password = hashedNewPassword;
  user.passwordChangedAt = Date.now() - 1000;
  await user.save();
};

const deleteUserData = async (userId) => {
  await Promise.all([
    Profile.deleteMany({ userId }),
    Quiz.deleteMany({ createdBy: userId }),
    QuizAttempt.deleteMany({ userId }),
    QuizRating.deleteMany({ userId }),
    SavedQuiz.deleteMany({ userId }),
    Statistics.deleteMany({ userId }),
    QuizPrompt.deleteMany({}),
  ]);
};

const deleteUserAccount = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User account not found');
  }

  await deleteUserData(userId);
  await User.findByIdAndDelete(userId);
};

module.exports = {
  changePassword,
  deleteUserAccount,
};

