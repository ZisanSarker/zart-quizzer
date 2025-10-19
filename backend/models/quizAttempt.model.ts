import mongoose, { Schema } from 'mongoose';
import { IQuizAttempt, IQuizAttemptAnswer } from '../types';

const AnswerSchema = new Schema<IQuizAttemptAnswer>({
  questionId: { type: Schema.Types.ObjectId, required: true },
  selectedAnswer: { type: String, required: true, trim: true },
  isCorrect: { type: Boolean, required: true }
});

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  answers: [AnswerSchema],
  score: { type: Number, required: true },
  timeTaken: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  completedAt: { type: String }
});

export default mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
