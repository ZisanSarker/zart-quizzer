import api from "./api"

export interface RatingStats {
  average: number
  count: number
  userRating: number | null
}

export interface MultipleRatingsResponse {
  ratings: Record<string, number>
}

export const getQuizRating = async (quizId: string): Promise<{ rating: number }> => {
  const response = await api.get<{ rating: number }>(`/ratings/quiz/${quizId}`)
  return response.data
}

export const getQuizRatingStats = async (quizId: string): Promise<RatingStats> => {
  const response = await api.get<RatingStats>(`/ratings/quiz/${quizId}/stats`)
  return response.data
}

export const rateQuiz = async (quizId: string, rating: number): Promise<{ message: string; rating: any }> => {
  const response = await api.post<{ message: string; rating: any }>(`/ratings/quiz/${quizId}`, { rating })
  return response.data
}

export const getMultipleQuizRatings = async (quizIds: string[]): Promise<MultipleRatingsResponse> => {
  const response = await api.post<MultipleRatingsResponse>('/ratings/multiple', { quizIds })
  return response.data
} 