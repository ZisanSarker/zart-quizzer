const mongoose = require('mongoose');

const QuizRatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

QuizRatingSchema.index({ userId: 1, quizId: 1 }, { unique: true });

module.exports = mongoose.model('QuizRating', QuizRatingSchema);