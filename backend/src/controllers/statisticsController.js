const statisticsService = require('../services/statisticsService');

const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.userId || req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const stats = await statisticsService.getUserStats(userId);

    res.status(200).json({
      message: 'Statistics retrieved successfully',
      ...stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserStats,
};

