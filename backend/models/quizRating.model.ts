import mongoose, { Schema } from 'mongoose';
import { IQuizRating } from '../types';

const QuizRatingSchema = new Schema<IQuizRating>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

QuizRatingSchema.index({ userId: 1, quizId: 1 }, { unique: true });

export default mongoose.model<IQuizRating>('QuizRating', QuizRatingSchema);
