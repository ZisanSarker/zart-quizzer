import api from "./api"
import type {
  Quiz,
  QuizSubmission,
  QuizResult,
  RecentQuizAttempt,
  RecommendedQuiz,
  QuizAttemptResult,
  ExploreQuiz,
  QuizRatingsResponse,
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
  const response = await api.get<RecentQuizAttempt[]>("/quizzes/recent")
  return response.data
}

export const getQuizById = async (id: string): Promise<Quiz> => {
  const response = await api.get<Quiz>(`/quizzes/${id}`)
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

export const deleteQuiz = async (quizId: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/quizzes/${quizId}`)
  return response.data
}

export const updateQuizVisibility = async (quizId: string, isPublic: boolean): Promise<{ message: string }> => {
  const response = await api.patch<{ message: string }>(`/quizzes/${quizId}/visibility`, { isPublic })
  return response.data
}

export const getRecommendedQuizzes = async (): Promise<RecommendedQuiz[]> => {
  const response = await api.get<RecommendedQuiz[]>("/quizzes/recommended")
  return response.data
}

export const getSavedQuizzes = async (): Promise<Quiz[]> => {
  const response = await api.get<Quiz[]>("/quizzes/saved");
  return response.data;
}

export const getQuizResultByAttemptId = async (attemptId: string): Promise<QuizAttemptResult> => {
  const response = await api.get<QuizAttemptResult>(`/quizzes/quiz-attempts/${attemptId}`);
  return response.data;
}

export const getExploreQuizzes = async (): Promise<ExploreQuiz[]> => {
  const response = await api.get<ExploreQuiz[]>("/quizzes/explore");
  return response.data;
};

// Save a quiz
export const saveQuiz = async (quizId: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/quizzes/save", { quizId });
  return response.data;
};

// Unsave a quiz
export const unsaveQuiz = async (quizId: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/quizzes/unsave", { quizId });
  return response.data;
};

// --- RATING API ---
export const rateQuiz = async (quizId: string, rating: number): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/quizzes/rate", { quizId, rating });
  return response.data;
}

export const getQuizRatings = async (quizId: string, user: boolean = false): Promise<QuizRatingsResponse> => {
  const url = `/quizzes/${quizId}/ratings${user ? "?user=true" : ""}`;
  const response = await api.get<QuizRatingsResponse>(url);
  return response.data;
}