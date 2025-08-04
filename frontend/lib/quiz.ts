import api from "./api"
import type {
  Quiz,
  QuizSubmission,
  QuizResult,
  RecentQuizAttempt,
  RecommendedQuiz,
  QuizAttemptResult,
  ExploreQuiz,
} from "@/types/quiz"

export interface GenerateQuizData {
  topic: string
  description?: string
  quizType: "multiple-choice" | "true-false" | "mixed"
  numberOfQuestions?: number
  difficulty?: "easy" | "medium" | "hard"
  isPublic?: boolean
  timeLimit: boolean
}

export interface GenerateQuizResponse {
  message: string
  quiz: Quiz
}

export const generateQuiz = async (data: GenerateQuizData): Promise<GenerateQuizResponse> => {
  const response = await api.post<GenerateQuizResponse>("/quizzes/generate", data)
  return response.data
}

export const getRecentQuizAttempts = async (): Promise<RecentQuizAttempt[]> => {
  try {
    const response = await api.get<RecentQuizAttempt[]>("/quizzes/recent")
    return response.data
  } catch (error) {
    console.error('Failed to fetch recent quiz attempts:', error)
    return []
  }
}

export const getQuizById = async (id: string): Promise<Quiz> => {
  const response = await api.get<Quiz>(`/quizzes/public/${id}`)
  return response.data
}

export const submitQuiz = async (data: QuizSubmission): Promise<QuizResult> => {
  const response = await api.post<QuizResult>("/quizzes/submit", data)
  return response.data
}

export const getUserQuizzes = async (userId: string): Promise<Quiz[]> => {
  const response = await api.get<Quiz[]>(`/quizzes/user/${userId}`)
  return response.data
}

export const getRecommendedQuizzes = async (): Promise<RecommendedQuiz[]> => {
  try {
    const response = await api.get<RecommendedQuiz[]>("/quizzes/recommended")
    return response.data
  } catch (error) {
    console.error('Failed to fetch recommended quizzes:', error)
    return []
  }
}

export const getSavedQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await api.get<Quiz[]>("/quizzes/saved");
    return response.data;
  } catch (error) {
    console.error('Failed to fetch saved quizzes:', error)
    return []
  }
}

export const getQuizResultByAttemptId = async (attemptId: string): Promise<QuizAttemptResult> => {
  const response = await api.get<QuizAttemptResult>(`/quizzes/quiz-attempts/${attemptId}`);
  return response.data;
}

export const getExploreQuizzes = async (): Promise<ExploreQuiz[]> => {
  try {
    const response = await api.get<ExploreQuiz[]>("/quizzes/public/explore");
    return response.data;
  } catch (error) {
    console.error('Failed to fetch explore quizzes:', error)
    return []
  }
};

export const saveQuiz = async (quizId: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/quizzes/save", { quizId });
  return response.data;
};

export const unsaveQuiz = async (quizId: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/quizzes/unsave", { quizId });
  return response.data;
};