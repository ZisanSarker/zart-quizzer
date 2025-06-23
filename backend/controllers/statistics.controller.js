const Quiz = require('../models/quiz.model');
const QuizAttempt = require('../models/quizAttempt.model');
const UserStats = require('../models/statistics.model');

// Badge logic
function getBadges(points) {
  const badges = [];
  if (points >= 10)
    badges.push({ id: "star1", name: "1 Star", description: "Earned 10 points", icon: "⭐" });
  if (points >= 20)
    badges.push({ id: "star2", name: "2 Stars", description: "Earned 20 points", icon: "⭐⭐" });
  if (points >= 30)
    badges.push({ id: "star3", name: "3 Stars", description: "Earned 30 points", icon: "⭐⭐⭐" });
  if (points >= 40)
    badges.push({ id: "star4", name: "4 Stars", description: "Earned 40 points", icon: "⭐⭐⭐⭐" });
  if (points >= 50)
    badges.push({ id: "star5", name: "5 Stars", description: "Earned 50 points", icon: "⭐⭐⭐⭐⭐" });
  return badges;
}

// Helper to upsert stats in DB
async function saveStatsToDb(userId, statsObj) {
  await UserStats.findOneAndUpdate(
    { userId },
    { $set: statsObj },
    { upsert: true, new: true }
  );
}

// For /api/statistics/me or /api/statistics/:userId
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId || req.params.userId;

    // Count quizzes created
    const quizzesCreated = await Quiz.countDocuments({ createdBy: userId });

    // All attempts
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

    // Points system
    const points = quizzesCreated * 1 + quizzesCompleted * 0.5;

    // Badges
    const badges = getBadges(points);

    // Optionally save to DB (for profile convenience)
    await saveStatsToDb(userId, {
      quizzesCreated,
      quizzesCompleted,
      totalScore,
      totalQuestions,
      totalTimeSpent,
      points,
      badges
    });

    const hours = Math.floor(totalTimeSpent / 3600);
    const minutes = Math.floor((totalTimeSpent % 3600) / 60);
    const timeSpentStr = `${hours}h ${minutes}m`;

    res.json({
      quizzesCreated,
      quizzesCompleted,
      averageScore,
      timeSpent: timeSpentStr,
      totalTimeSpentSeconds: totalTimeSpent,
      points,
      badges
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch user statistics', error: err.message });
  }
};