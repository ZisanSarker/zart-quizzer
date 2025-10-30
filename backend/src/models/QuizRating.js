const mongoose = require('mongoose');

const QuizRatingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

QuizRatingSchema.index({ userId: 1, quizId: 1 }, { unique: true });
QuizRatingSchema.index({ quizId: 1, rating: -1 });

module.exports = mongoose.model('QuizRating', QuizRatingSchema);

