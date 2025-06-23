export interface Badge {
  id: string
  name: string
  description: string
  icon: string
}

export interface UserStats {
  quizzesCreated: number
  quizzesCompleted: number
  averageScore: number
  timeSpent: string
  totalTimeSpentSeconds: number
  points: number
  badges: Badge[]
}