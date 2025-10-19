const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const Quiz = require('../models/quiz.model');
const QuizAttempt = require('../models/quizAttempt.model');
const QuizPrompt = require('../models/quizPrompt.model');
const QuizRating = require('../models/quizRating.model');
const SavedQuiz = require('../models/savedQuiz.model');
const Statistics = require('../models/statistics.model');
const { hashPassword, comparePassword } = require('../utils/userUtils');

const validatePasswordChange = (currentPassword, newPassword, confirmPassword) => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { valid: false, message: 'Please provide current and new passwords' };
  }

  if (newPassword !== confirmPassword) {
    return { valid: false, message: 'New passwords do not match' };
  }

  if (newPassword.length < 8) {
    return { valid: false, message: 'New password must be at least 8 characters long' };
  }

  if (!/\d/.test(newPassword)) {
    return { valid: false, message: 'New password must include at least one number' };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
    return { valid: false, message: 'New password must include at least one special character' };
  }

  return { valid: true };
};

const deleteUserData = async (userId) => {
  await Promise.all([
    Profile.deleteMany({ userId }),
    Quiz.deleteMany({ createdBy: userId }),
    QuizAttempt.deleteMany({ userId }),
    QuizRating.deleteMany({ userId }),
    SavedQuiz.deleteMany({ userId }),
    Statistics.deleteMany({ userId })
  ]);
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const validation = validatePasswordChange(currentPassword, newPassword, confirmPassword);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    user.passwordChangedAt = Date.now() - 1000;
    await user.save();

    console.log(`[SETTINGS] Password changed for user: ${userId}`);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(`[SETTINGS] Change password error: ${error.message}`);
    res.status(500).json({ message: 'Unable to change password. Please try again.' });
  }
};

exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    await deleteUserData(userId);
    await User.findByIdAndDelete(userId);

    console.log(`[SETTINGS] Account deleted for user: ${userId}`);

    res.status(200).json({ message: 'Account and all data deleted successfully' });
  } catch (error) {
    console.error(`[SETTINGS] Delete account error: ${error.message}`);
    res.status(500).json({ message: 'Unable to delete account. Please try again.' });
  }
};
