export interface QuizQuestion {
  _id: string
  questionText: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export interface Quiz {
  _id: string
  topic: string
  description?: string
  quizType: "multiple-choice" | "true-false" | "mixed"
  difficulty: "easy" | "medium" | "hard"
  numberOfQuestions?: number
  timeLimit?: boolean
  isPublic?: boolean
  questions: QuizQuestion[]
  promptRef?: string
  createdBy?: string
  createdAt: string
}

export interface QuizAnswer {
  _id: string
  selectedAnswer: string
}

export interface QuizSubmission {
  quizId: string
  userId?: string
  answers: QuizAnswer[]
}

export interface QuizResultAnswer {
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
  correctAnswer: string
  explanation: string
}

export interface QuizResult {
  message: string
  score: number
  total: number
  result: QuizResultAnswer[]
  attemptId?: string
}

export interface RecentQuizAttempt {
  id: string
  title: string
  score: number
  date: string
  quizId: string
  quizTitle: string
  totalQuestions: number
  correctAnswers: number
  timeTaken: string | 'N/A'
  completedAt: string
}

export interface RecommendedQuiz {
  id: string
  title: string
  author: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

export interface QuizAttemptResult {
  _id: string
  quizId: Quiz
  userId: string
  answers: QuizResultAnswer[]
  score: number
  submittedAt: string
}