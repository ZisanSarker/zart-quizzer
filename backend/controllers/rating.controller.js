const QuizRating = require('../models/quizRating.model');

exports.getRating = async (req, res) => {
  try {
    const { quizId } = req.params;
    const ratings = await QuizRating.find({ quizId });
    
    if (ratings.length === 0) {
      return res.json({ rating: 0 });
    }
    
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = Number((totalRating / ratings.length).toFixed(2));
    
    res.json({ rating: averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rating', error: error.message });
  }
};

exports.getRatingStats = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId } = req;
    
    const ratings = await QuizRating.find({ quizId });
    const count = ratings.length;
    const average = count === 0 ? 0 : Number((ratings.reduce((sum, rating) => sum + rating.rating, 0) / count).toFixed(2));
    
    let userRating = null;
    if (userId) {
      const userRatingDoc = await QuizRating.findOne({ quizId, userId });
      userRating = userRatingDoc ? userRatingDoc.rating : null;
    }
    
    res.json({ average, count, userRating });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rating stats', error: error.message });
  }
};

exports.rateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { rating } = req.body;
    const { userId } = req;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const ratingDoc = await QuizRating.findOneAndUpdate(
      { userId, quizId },
      { rating, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    
    res.json({ message: 'Rating updated successfully', rating: ratingDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error rating quiz', error: error.message });
  }
};

exports.getMultipleQuizRatings = async (req, res) => {
  try {
    const { quizIds } = req.body;
    
    if (!Array.isArray(quizIds)) {
      return res.status(400).json({ message: 'quizIds must be an array' });
    }
    
    const ratings = await QuizRating.find({ quizId: { $in: quizIds } });
    const ratingMap = {};
    
    quizIds.forEach(quizId => {
      ratingMap[quizId] = 0;
    });
    
    const ratingsByQuiz = {};
    ratings.forEach(rating => {
      if (!ratingsByQuiz[rating.quizId]) {
        ratingsByQuiz[rating.quizId] = [];
      }
      ratingsByQuiz[rating.quizId].push(rating.rating);
    });
    
    Object.keys(ratingsByQuiz).forEach(quizId => {
      const quizRatings = ratingsByQuiz[quizId];
      const average = quizRatings.reduce((sum, rating) => sum + rating, 0) / quizRatings.length;
      ratingMap[quizId] = Number(average.toFixed(2));
    });
    
    res.json({ ratings: ratingMap });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching multiple ratings', error: error.message });
  }
};
