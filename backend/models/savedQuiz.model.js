const mongoose = require('mongoose');
const SavedQuizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  savedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('SavedQuiz', SavedQuizSchema);