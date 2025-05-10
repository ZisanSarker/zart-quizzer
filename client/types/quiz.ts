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
  difficulty: "easy" | "medium" | "hard"
  questions: QuizQuestion[]
  promptRef: string
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
}

export interface RecentQuizAttempt {
  id: string;
  title: string;
  score: number;
  date: string;

  // Additional fields
  quizId: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: string | 'N/A';
  completedAt: string;
}


export interface RecommendedQuiz {
  id: string
  title: string
  author: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}
