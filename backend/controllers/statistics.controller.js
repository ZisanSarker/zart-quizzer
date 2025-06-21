const Quiz = require('../models/quiz.model');
const QuizAttempt = require('../models/quizAttempt.model');

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.userId || req.params.userId;

    const quizzesCreated = await Quiz.countDocuments({ createdBy: userId });

    const attempts = await QuizAttempt.find({ userId });

    const quizzesCompleted = attempts.length;
    const totalScore = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
    const totalQuestions = attempts.reduce(
      (sum, a) => sum + (a.answers ? a.answers.length : 0),
      0
    );
    const totalTimeSpent = attempts.reduce(
      (sum, a) => sum + (typeof a.timeTaken === 'number' ? a.timeTaken : 0),
      0
    );
    const averageScore =
      totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    const hours = Math.floor(totalTimeSpent / 3600);
    const minutes = Math.floor((totalTimeSpent % 3600) / 60);
    const timeSpentStr = `${hours}h ${minutes}m`;

    res.json({
      quizzesCreated,
      quizzesCompleted,
      averageScore,
      timeSpent: timeSpentStr,
      totalTimeSpentSeconds: totalTimeSpent,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch user statistics', error: err.message });
  }
};
