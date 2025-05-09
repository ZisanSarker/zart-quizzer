const mongoose = require('mongoose');

const QuizPromptSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  numberOfQuestions: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QuizPrompt', QuizPromptSchema);
