const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const Quiz = require('../models/quiz.model');
const QuizAttempt = require('../models/quizAttempt.model');
const QuizPrompt = require('../models/quizPrompt.model');
const QuizRating = require('../models/quizRating.model');
const SavedQuiz = require('../models/savedQuiz.model');
const Statistics = require('../models/statistics.model');

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
