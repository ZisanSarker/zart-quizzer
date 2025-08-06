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

const calculateTimeBasedStats = async (userId) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Get quizzes created in different time periods
  const thisWeekQuizzes = await Quiz.countDocuments({
    createdBy: userId,
    createdAt: { $gte: oneWeekAgo }
  });
  
  const thisMonthQuizzes = await Quiz.countDocuments({
    createdBy: userId,
    createdAt: { $gte: oneMonthAgo }
  });
  
  // Get last 7 days score data
  const last7DaysAttempts = await QuizAttempt.find({
    userId,
    submittedAt: { $gte: oneWeekAgo }
  }).sort({ submittedAt: 1 });
  
  // Calculate daily scores for the last 7 days
  const dailyScores = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const dayAttempts = last7DaysAttempts.filter(attempt => {
      const attemptDate = new Date(attempt.submittedAt);
      return attemptDate >= dayStart && attemptDate < dayEnd;
    });
    
    let dayScore = 0;
    if (dayAttempts.length > 0) {
      const totalScore = dayAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      const totalQuestions = dayAttempts.reduce((sum, attempt) => sum + (attempt.answers ? attempt.answers.length : 0), 0);
      dayScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    }
    
    dailyScores.push({
      day: dayNames[date.getDay()],
      score: dayScore,
      target: 85,
      aboveTarget: dayScore >= 85
    });
  }
  
  return {
    thisWeekQuizzes,
    thisMonthQuizzes,
    dailyScores
  };
};



const calculateUserStats = async (userId) => {
  const quizzesCreated = await Quiz.countDocuments({ createdBy: userId });
  const attempts = await QuizAttempt.find({ userId });

  // Calculate completed vs attempted statistics
  const quizzesCompleted = attempts.length;
  const quizzesAttempted = attempts.length; // Since all attempts are considered completed in this model
  
  const totalScore = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
  const totalQuestions = attempts.reduce((sum, a) => sum + (a.answers ? a.answers.length : 0), 0);
  const totalTimeSpent = attempts.reduce((sum, a) => sum + (typeof a.timeTaken === 'number' ? a.timeTaken : 0), 0);
  
  const averageScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
  const points = quizzesCreated * 1 + quizzesCompleted * 0.5;
  const badges = getBadges(points);

  // Get time-based statistics
  const timeBasedStats = await calculateTimeBasedStats(userId);

  return {
    quizzesCreated,
    quizzesCompleted,
    quizzesAttempted,
    totalScore,
    totalQuestions,
    totalTimeSpent,
    averageScore,
    points,
    badges,
    timeSpentFormatted: formatTimeSpent(totalTimeSpent),
    ...timeBasedStats
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