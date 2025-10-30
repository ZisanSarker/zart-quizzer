const ratingService = require('../services/ratingService');
const { validateRating } = require('../validators/quiz');

const getRating = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const stats = await ratingService.getRatingStats(quizId);
    res.status(200).json({ rating: stats.average });
  } catch (error) {
    next(error);
  }
};

const getRatingStats = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId || req.user?._id || null;

    const stats = await ratingService.getRatingStats(quizId, userId);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

const rateQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { rating } = req.body;
    const userId = req.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    validateRating(rating);

    const result = await ratingService.rateQuiz(userId, quizId, rating);

    res.status(200).json({
      message: 'Rating updated successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getMultipleQuizRatings = async (req, res, next) => {
  try {
    const { quizIds } = req.body;

    if (!Array.isArray(quizIds)) {
      return res.status(400).json({ message: 'quizIds must be an array' });
    }

    const ratings = await ratingService.getMultipleQuizRatings(quizIds);

    res.status(200).json({ ratings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRating,
  getRatingStats,
  rateQuiz,
  getMultipleQuizRatings,
};

