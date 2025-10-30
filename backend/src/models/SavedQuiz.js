const mongoose = require('mongoose');

const SavedQuizSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

SavedQuizSchema.index({ userId: 1, quizId: 1 }, { unique: true });

module.exports = mongoose.model('SavedQuiz', SavedQuizSchema);

