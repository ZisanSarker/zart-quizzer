const { QuizRating, Quiz } = require('../models');
const { NotFoundError, ForbiddenError, ValidationError } = require('../errors');

const getRatingStats = async (quizId, userId = null) => {
  const ratings = await QuizRating.find({ quizId });
  const count = ratings.length;
  const average =
    count === 0
      ? 0
      : Number(
          (
            ratings.reduce((sum, rating) => sum + rating.rating, 0) / count
          ).toFixed(2)
        );

  let userRating = null;
  if (userId) {
    const userRatingDoc = await QuizRating.findOne({ quizId, userId });
    userRating = userRatingDoc ? userRatingDoc.rating : null;
  }

  return { average, count, userRating };
};

const getMultipleQuizRatings = async (quizIds) => {
  const ratings = await QuizRating.find({ quizId: { $in: quizIds } });
  const ratingMap = {};

  quizIds.forEach((quizId) => {
    ratingMap[quizId.toString()] = 0;
  });

  const ratingsByQuiz = {};
  ratings.forEach((rating) => {
    const quizIdStr = rating.quizId.toString();
    if (!ratingsByQuiz[quizIdStr]) {
      ratingsByQuiz[quizIdStr] = [];
    }
    ratingsByQuiz[quizIdStr].push(rating.rating);
  });

  Object.keys(ratingsByQuiz).forEach((quizId) => {
    const quizRatings = ratingsByQuiz[quizId];
    const average =
      quizRatings.reduce((sum, rating) => sum + rating, 0) /
      quizRatings.length;
    ratingMap[quizId] = Number(average.toFixed(2));
  });

  return ratingMap;
};

const rateQuiz = async (userId, quizId, rating) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new NotFoundError('Quiz not found');
  }

  if (quiz.createdBy.toString() === userId.toString()) {
    throw new ForbiddenError('You cannot rate your own quiz');
  }

  if (!quiz.isPublic) {
    throw new ForbiddenError('You can only rate public quizzes');
  }

  const ratingDoc = await QuizRating.findOneAndUpdate(
    { userId, quizId },
    { rating },
    { upsert: true, new: true }
  );

  const stats = await getRatingStats(quizId);

  return {
    rating: ratingDoc.rating,
    averageRating: stats.average,
    totalRatings: stats.count,
  };
};

module.exports = {
  getRatingStats,
  getMultipleQuizRatings,
  rateQuiz,
};

