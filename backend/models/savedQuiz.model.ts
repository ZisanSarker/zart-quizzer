import mongoose, { Schema } from 'mongoose';
import { ISavedQuiz } from '../types';

const SavedQuizSchema = new Schema<ISavedQuiz>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  savedAt: { type: Date, default: Date.now },
});

SavedQuizSchema.index({ userId: 1, quizId: 1 }, { unique: true });

export default mongoose.model<ISavedQuiz>('SavedQuiz', SavedQuizSchema);
