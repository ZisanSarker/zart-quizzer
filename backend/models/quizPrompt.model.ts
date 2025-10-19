import mongoose, { Schema } from 'mongoose';
import { IQuizPrompt } from '../types';

const QuizPromptSchema = new Schema<IQuizPrompt>({
  topic: { type: String, required: true },
  description: { type: String },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  numberOfQuestions: { type: Number, default: 5 },
  quizType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'mixed'],
    default: 'multiple-choice'
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuizPrompt>('QuizPrompt', QuizPromptSchema);
