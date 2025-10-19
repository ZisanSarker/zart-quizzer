const mongoose = require('mongoose');

const SavedQuizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  savedAt: { type: Date, default: Date.now },
});

SavedQuizSchema.index({ userId: 1, quizId: 1 }, { unique: true });

module.exports = mongoose.model('SavedQuiz', SavedQuizSchema);