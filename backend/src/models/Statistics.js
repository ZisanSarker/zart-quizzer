const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { _id: false }
);

const UserStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
      index: true,
    },
    quizzesCreated: { type: Number, default: 0, min: 0 },
    quizzesCompleted: { type: Number, default: 0, min: 0 },
    totalScore: { type: Number, default: 0, min: 0 },
    totalQuestions: { type: Number, default: 0, min: 0 },
    totalTimeSpent: { type: Number, default: 0, min: 0 },
    points: { type: Number, default: 0, min: 0 },
    badges: { type: [BadgeSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserStats', UserStatsSchema);

