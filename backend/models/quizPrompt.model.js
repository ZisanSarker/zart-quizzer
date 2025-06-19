const mongoose = require('mongoose');

const QuizPromptSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  numberOfQuestions: { type: Number, default: 5 },
  quizType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'mixed'],
    default: 'multiple-choice'
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QuizPrompt', QuizPromptSchema);