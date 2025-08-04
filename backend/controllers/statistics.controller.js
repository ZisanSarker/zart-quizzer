const Quiz = require('../models/quiz.model');
const QuizAttempt = require('../models/quizAttempt.model');
const UserStats = require('../models/statistics.model');

const getBadges = (points) => {
  const badges = [];
  if (points >= 10) badges.push({ id: "star1", name: "1 Star", description: "Earned 10 points", icon: "⭐" });
  if (points >= 20) badges.push({ id: "star2", name: "2 Stars", description: "Earned 20 points", icon: "⭐⭐" });
  if (points >= 30) badges.push({ id: "star3", name: "3 Stars", description: "Earned 30 points", icon: "⭐⭐⭐" });
  if (points >= 40) badges.push({ id: "star4", name: "4 Stars", description: "Earned 40 points", icon: "⭐⭐⭐⭐" });
  if (points >= 50) badges.push({ id: "star5", name: "5 Stars", description: "Earned 50 points", icon: "⭐⭐⭐⭐⭐" });
  return badges;
};

const saveStatsToDb = async (userId, statsObj) => {
  await UserStats.findOneAndUpdate(
    { userId },
    { $set: statsObj },
    { upsert: true, new: true }
  );
};

const formatTimeSpent = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const calculateUserStats = async (userId) => {
  const quizzesCreated = await Quiz.countDocuments({ createdBy: userId });
  const attempts = await QuizAttempt.find({ userId });

  const quizzesCompleted = attempts.length;
  const totalScore = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
  const totalQuestions = attempts.reduce((sum, a) => sum + (a.answers ? a.answers.length : 0), 0);
  const totalTimeSpent = attempts.reduce((sum, a) => sum + (typeof a.timeTaken === 'number' ? a.timeTaken : 0), 0);
  
  const averageScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
  const points = quizzesCreated * 1 + quizzesCompleted * 0.5;
  const badges = getBadges(points);

  return {
    quizzesCreated,
    quizzesCompleted,
    totalScore,
    totalQuestions,
    totalTimeSpent,
    averageScore,
    points,
    badges,
    timeSpentFormatted: formatTimeSpent(totalTimeSpent)
  };
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId || req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const stats = await calculateUserStats(userId);
    
    await saveStatsToDb(userId, {
      quizzesCreated: stats.quizzesCreated,
      quizzesCompleted: stats.quizzesCompleted,
      totalScore: stats.totalScore,
      totalQuestions: stats.totalQuestions,
      totalTimeSpent: stats.totalTimeSpent,
      points: stats.points,
      badges: stats.badges
    });

    console.log(`[STATS] Statistics retrieved for user: ${userId}`);

    res.status(200).json({
      message: 'Statistics retrieved successfully',
      ...stats,
      timeSpent: stats.timeSpentFormatted
    });
  } catch (error) {
    console.error(`[STATS] Get user stats error: ${error.message}`);
    res.status(500).json({ message: 'Unable to retrieve statistics. Please try again.' });
  }
};