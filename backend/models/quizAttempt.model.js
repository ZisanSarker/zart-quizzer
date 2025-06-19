const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedAnswer: { type: String, required: true, trim: true },
  isCorrect: { type: Boolean, required: true }
});

const QuizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  answers: [AnswerSchema],
  score: { type: Number, required: true },
  timeTaken: { type: String, default: '00:00' },
  submittedAt: { type: Date, default: Date.now },
  completedAt: { type: String }
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);