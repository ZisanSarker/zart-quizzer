const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true, trim: true },
  options: [
    {
      type: String,
      required: function () {
        return this.type !== 'true-false';
      },
      trim: true,
    },
  ],
  correctAnswer: { type: String, required: true, trim: true },
  explanation: { type: String, trim: true },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false'],
    default: 'multiple-choice',
  },
});

const QuizSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    quizType: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'mixed'],
      default: 'multiple-choice',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
      index: true,
    },
    isPublic: { type: Boolean, default: false, index: true },
    timeLimit: { type: Boolean, default: true },
    questions: [QuestionSchema],
    tags: [{ type: String, trim: true, lowercase: true }],
    promptRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuizPrompt',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

QuizSchema.index({ createdAt: -1 });
QuizSchema.index({ topic: 'text', description: 'text' });

module.exports = mongoose.model('Quiz', QuizSchema);

