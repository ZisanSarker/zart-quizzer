const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const Quiz = require('../models/quiz.model');
const QuizAttempt = require('../models/quizAttempt.model');
const QuizPrompt = require('../models/quizPrompt.model');
const QuizRating = require('../models/quizRating.model');
const SavedQuiz = require('../models/savedQuiz.model');
const Statistics = require('../models/statistics.model');

// POST /settings/change-password
exports.changePassword = async (req, res) => {
  const { userId } = req;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ message: 'Please provide current and new passwords.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New passwords do not match.' });
  }

  try {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await user.correctPassword(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error changing password.', error: error.message });
  }
};

// DELETE /users/:userId
exports.deleteUserAccount = async (req, res) => {
  const { userId } = req;

  try {
    // Delete all related data
    await Profile.deleteMany({ user: userId });
    await Quiz.deleteMany({ createdBy: userId });
    await QuizAttempt.deleteMany({ user: userId });
    // await QuizPrompt.deleteMany({ user: userId });
    await QuizRating.deleteMany({ user: userId });
    await SavedQuiz.deleteMany({ user: userId });
    await Statistics.deleteMany({ user: userId });

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      message: 'User account and all related data deleted successfully.',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting user account.', error: error.message });
  }
};
