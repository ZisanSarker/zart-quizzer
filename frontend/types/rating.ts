export interface RatingStats {
  average: number
  count: number
  userRating: number | null
}

export interface MultipleRatingsResponse {
  ratings: Record<string, number>
}

export interface QuizRating {
  _id: string
  quizId: string
  userId: string
  rating: number
  createdAt: string
  updatedAt: string
} 