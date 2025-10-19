import { Document, Types } from 'mongoose';

// Keep backend-specific copies of public-facing types
export type AuthProvider = 'local' | 'google' | 'github';
export interface PublicUser {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  role: 'user' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  provider: AuthProvider;
}

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  githubId?: string;
  profilePicture: string;
  role: 'user' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: Date | null;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// AuthProvider and PublicUser are shared via @shared/types

// Quiz Types
export interface IQuizQuestion {
  _id: Types.ObjectId;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: 'multiple-choice' | 'true-false';
}

export interface IQuiz extends Document {
  _id: Types.ObjectId;
  topic: string;
  description?: string;
  quizType: 'multiple-choice' | 'true-false' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  isPublic: boolean;
  timeLimit: boolean;
  questions: Types.DocumentArray<IQuizQuestion>;
  promptRef?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

// Quiz Prompt Types
export interface IQuizPrompt extends Document {
  _id: Types.ObjectId;
  topic: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
  quizType: 'multiple-choice' | 'true-false' | 'mixed';
  createdAt: Date;
}

// Quiz Attempt Types
export interface IQuizAttemptAnswer {
  questionId: Types.ObjectId;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface IQuizAttempt extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  quizId: Types.ObjectId | IQuiz;
  answers: IQuizAttemptAnswer[];
  score: number;
  timeTaken: number;
  submittedAt: Date;
  completedAt?: string;
}

// Profile Types
export interface ISocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export interface IBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface IProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId | IUser;
  bio: string;
  location: string;
  website: string;
  socialLinks: ISocialLinks;
  badges: IBadge[];
  createdAt: Date;
  updatedAt: Date;
}

// Statistics Types
export interface IUserStats extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  quizzesCreated: number;
  quizzesCompleted: number;
  totalScore: number;
  totalQuestions: number;
  totalTimeSpent: number;
  points: number;
  badges: IBadge[];
}

// Rating Types
export interface IQuizRating extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Saved Quiz Types
export interface ISavedQuiz extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  savedAt: Date;
}

// Search Query Types
export interface ISearchQuery extends Document {
  _id: Types.ObjectId;
  query: string;
  count: number;
  lastSearched: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response Types
export interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface ChangePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface QuizGenerationRequestBody {
  topic: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  numberOfQuestions?: number;
  quizType?: 'multiple-choice' | 'true-false' | 'mixed';
  isPublic?: boolean;
  timeLimit?: boolean;
}

export interface QuizAnswer {
  _id: string;
  selectedAnswer: string;
}

export interface QuizSubmissionRequestBody {
  quizId: string;
  userId?: string;
  answers: QuizAnswer[];
  timeTaken?: number;
}

export interface RatingRequestBody {
  quizId: string;
  rating: number;
}

export interface SaveQuizRequestBody {
  quizId: string;
}

export interface ProfileUpdateRequestBody {
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: ISocialLinks;
  badges?: IBadge[];
  username?: string;
}

// Token Types
export interface TokenPayload {
  userId: string;
}

export interface JWTDecoded {
  userId: string;
  iat: number;
  exp: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface QuizResultAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

export interface QuizSubmissionResponse {
  message: string;
  score: number;
  total: number;
  result: QuizResultAnswer[];
  attemptId: string;
}

export interface RatingStats {
  average: number;
  count: number;
  userRating: number | null;
}

export interface RecentQuizAttempt {
  id: string;
  title: string;
  score: number; // ensure numeric percentage for frontend alignment
  date: string;
  quizId: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number | string;
  completedAt: string;
}

export interface RecommendedQuiz {
  id: string;
  title: string;
  author: string;
  difficulty: string;
  averageRating: number;
}

export interface DailyScore {
  day: string;
  score: number;
  target: number;
  aboveTarget: boolean;
}

export interface UserStatsResponse {
  quizzesCreated: number;
  quizzesCompleted: number;
  quizzesAttempted: number;
  averageScore: number;
  timeSpent: string;
  totalTimeSpentSeconds: number;
  points: number;
  badges: IBadge[];
  thisWeekQuizzes: number;
  thisMonthQuizzes: number;
  dailyScores: DailyScore[];
}

export interface ExploreQuizAuthor {
  name: string;
  avatar?: string;
  initials?: string;
  _id?: string;
}

export interface ExploreQuiz {
  _id: string;
  topic: string;
  description?: string;
  quizType: 'multiple-choice' | 'true-false' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  questions: IQuizQuestion[];
  isPublic?: boolean;
  timeLimit?: boolean;
  createdAt: string;
  tags?: string[];
  attempts: number;
  rating: number;
  ratingCount: number;
  author: ExploreQuizAuthor;
}

// Validation Result Types
export interface ValidationResult {
  valid: boolean;
  message?: string;
  updateData?: any;
}

// Profile Stats Types
export interface ProfileStats {
  quizzesCreated: number;
  quizzesTaken: number;
  averageScore: number;
  followers: number;
  following: number;
}

export interface ProfileData {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  bio: string;
  location: string;
  website: string;
  socialLinks: ISocialLinks;
  badges: IBadge[];
  createdAt: Date;
  updatedAt: Date;
  userIdObj: {
    username: string;
    email: string;
    profilePicture: string;
    createdAt: Date;
  };
  stats: ProfileStats;
}

// Auth API responses
// Use shared DTOs from @shared/types for cross-app alignment

