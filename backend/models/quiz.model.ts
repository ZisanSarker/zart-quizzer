import mongoose, { Schema } from 'mongoose';
import { IQuiz, IQuizQuestion } from '../types';

const QuestionSchema = new Schema<IQuizQuestion>({
  questionText: { type: String, required: true },
  options: [{ 
    type: String, 
    required: function(this: IQuizQuestion) {
      return this.type !== 'true-false';
    } 
  }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  type: { 
    type: String, 
    enum: ['multiple-choice', 'true-false'], 
    default: 'multiple-choice' 
  }
});

const QuizSchema = new Schema<IQuiz>({
  topic: { type: String, required: true },
  description: { type: String },
  quizType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'mixed'],
    default: 'multiple-choice'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  isPublic: { type: Boolean, default: false },
  timeLimit: { type: Boolean, default: true }, 
  questions: [QuestionSchema],
  promptRef: { type: Schema.Types.ObjectId, ref: 'QuizPrompt' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
