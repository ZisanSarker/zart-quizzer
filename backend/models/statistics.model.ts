import mongoose, { Schema } from 'mongoose';
import { IUserStats, IBadge } from '../types';

const BadgeSchema = new Schema<IBadge>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }
}, { _id: false });

const UserStatsSchema = new Schema<IUserStats>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  quizzesCreated: { type: Number, default: 0 },
  quizzesCompleted: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  badges: { type: [BadgeSchema], default: [] }
});

export default mongoose.model<IUserStats>('UserStats', UserStatsSchema);
