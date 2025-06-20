const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: function() {
    return this.type !== 'true-false';
  } }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  type: { type: String, enum: ['multiple-choice', 'true-false'], default: 'multiple-choice' }
});

const QuizSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String },
  quizType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'mixed'],
    default: 'multiple-choice'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  isPublic: { type: Boolean, default: false },
  timeLimit: { type: Boolean, default: true }, 
  questions: [QuestionSchema],
  promptRef: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizPrompt' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', QuizSchema);