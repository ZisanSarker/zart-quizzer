const { Quiz, QuizAttempt, Statistics } = require('../models');
const { formatTimeSpent } = require('../utils/date');

const getBadges = (points) => {
  const badges = [];
  if (points >= 10) {
    badges.push({
      id: 'star1',
      name: '1 Star',
      description: 'Earned 10 points',
      icon: '⭐',
    });
  }
  if (points >= 20) {
    badges.push({
      id: 'star2',
      name: '2 Stars',
      description: 'Earned 20 points',
      icon: '⭐⭐',
    });
  }
  if (points >= 30) {
    badges.push({
      id: 'star3',
      name: '3 Stars',
      description: 'Earned 30 points',
      icon: '⭐⭐⭐',
    });
  }
  if (points >= 40) {
    badges.push({
      id: 'star4',
      name: '4 Stars',
      description: 'Earned 40 points',
      icon: '⭐⭐⭐⭐',
    });
  }
  if (points >= 50) {
    badges.push({
      id: 'star5',
      name: '5 Stars',
      description: 'Earned 50 points',
      icon: '⭐⭐⭐⭐⭐',
    });
  }
  return badges;
};

const calculateTimeBasedStats = async (userId) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const thisWeekQuizzes = await Quiz.countDocuments({
    createdBy: userId,
    createdAt: { $gte: oneWeekAgo },
  });

  const thisMonthQuizzes = await Quiz.countDocuments({
    createdBy: userId,
    createdAt: { $gte: oneMonthAgo },
  });

  const last7DaysAttempts = await QuizAttempt.find({
    userId,
    createdAt: { $gte: oneWeekAgo },
  }).sort({ createdAt: 1 });

  const dailyScores = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const dayAttempts = last7DaysAttempts.filter((attempt) => {
      const attemptDate = new Date(attempt.createdAt);
      return attemptDate >= dayStart && attemptDate < dayEnd;
    });

    let dayScore = 0;
    if (dayAttempts.length > 0) {
      const totalScore = dayAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      const totalQuestions = dayAttempts.reduce(
        (sum, attempt) => sum + (attempt.answers ? attempt.answers.length : 0),
        0
      );
      dayScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    }

    dailyScores.push({
      day: dayNames[date.getDay()],
      score: dayScore,
      target: 85,
      aboveTarget: dayScore >= 85,
    });
  }

  return {
    thisWeekQuizzes,
    thisMonthQuizzes,
    dailyScores,
  };
};

const calculateUserStats = async (userId) => {
  const quizzesCreated = await Quiz.countDocuments({ createdBy: userId });
  const attempts = await QuizAttempt.find({ userId });

  const quizzesCompleted = attempts.length;
  const quizzesAttempted = attempts.length;

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
  const points = quizzesCreated * 1 + quizzesCompleted * 0.5;
  const badges = getBadges(points);

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
    ...timeBasedStats,
  };
};

const getUserStats = async (userId) => {
  const stats = await calculateUserStats(userId);

  await Statistics.findOneAndUpdate(
    { userId },
    {
      $set: {
        quizzesCreated: stats.quizzesCreated,
        quizzesCompleted: stats.quizzesCompleted,
        totalScore: stats.totalScore,
        totalQuestions: stats.totalQuestions,
        totalTimeSpent: stats.totalTimeSpent,
        points: stats.points,
        badges: stats.badges,
      },
    },
    { upsert: true, new: true }
  );

  return {
    ...stats,
    timeSpent: stats.timeSpentFormatted,
  };
};

module.exports = {
  getUserStats,
};

