import api from "./api"
import type { Quiz, QuizSubmission, QuizResult, RecentQuizAttempt, RecommendedQuiz } from "@/types/quiz"

export interface GenerateQuizData {
  topic: string
  description?: string
  quizType: "multiple-choice" | "true-false" | "mixed"
  numberOfQuestions?: number
  difficulty?: "easy" | "medium" | "hard"
}

export interface GenerateQuizResponse {
  message: string
  quiz: Quiz
}

// Generate a new quiz
export const generateQuiz = async (data: GenerateQuizData): Promise<GenerateQuizResponse> => {
  const response = await api.post<GenerateQuizResponse>("/quizzes/generate", data)
  return response.data
}

// ✅ Get recent quiz attempts (not all quizzes)
export const getRecentQuizAttempts = async (): Promise<RecentQuizAttempt[]> => {
  const response = await api.get<RecentQuizAttempt[]>("/quizzes/recent")
  return response.data
}

// Get a quiz by ID
export const getQuizById = async (id: string): Promise<Quiz> => {
  const response = await api.get<Quiz>(`/quizzes/${id}`)
  return response.data
}

// Submit a quiz
export const submitQuiz = async (data: QuizSubmission): Promise<QuizResult> => {
  const response = await api.post<QuizResult>("/quizzes/submit", data)
  return response.data
}

// Get user's quizzes
export const getUserQuizzes = async (userId: string): Promise<Quiz[]> => {
  const response = await api.get<Quiz[]>(`/quizzes/user/${userId}`)
  return response.data
}

// Delete a quiz
export const deleteQuiz = async (quizId: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/quizzes/${quizId}`)
  return response.data
}

// Update quiz visibility (public/private)
export const updateQuizVisibility = async (quizId: string, isPublic: boolean): Promise<{ message: string }> => {
  const response = await api.patch<{ message: string }>(`/quizzes/${quizId}/visibility`, { isPublic })
  return response.data
}

// Get recommended quizzes
export const getRecommendedQuizzes = async (): Promise<RecommendedQuiz[]> => {
  const response = await api.get<RecommendedQuiz[]>("/quizzes/recommended")
  return response.data
}
