const mongoose = require("mongoose");

const UserStatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  quizzesCreated: { type: Number, default: 0 },
  quizzesCompleted: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 },
});

module.exports = mongoose.model("UserStats", UserStatsSchema);