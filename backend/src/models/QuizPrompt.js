const mongoose = require('mongoose');

const QuizPromptSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    numberOfQuestions: { type: Number, default: 5, min: 1 },
    quizType: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'mixed'],
      default: 'multiple-choice',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QuizPrompt', QuizPromptSchema);

