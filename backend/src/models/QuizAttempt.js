const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedAnswer: { type: String, required: true, trim: true },
  isCorrect: { type: Boolean, required: true },
  correctAnswer: { type: String, trim: true },
  explanation: { type: String, trim: true },
});

const QuizAttemptSchema = new mongoose.Schema(
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
    answers: [AnswerSchema],
    score: { type: Number, required: true, min: 0 },
    timeTaken: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

QuizAttemptSchema.index({ userId: 1, submittedAt: -1 });
QuizAttemptSchema.index({ quizId: 1, score: -1 });

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);

