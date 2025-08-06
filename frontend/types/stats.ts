export interface Badge {
  id: string
  name: string
  description: string
  icon: string
}

export interface DailyScore {
  day: string
  score: number
  target: number
  aboveTarget: boolean
}

export interface UserStats {
  quizzesCreated: number
  quizzesCompleted: number
  quizzesAttempted: number
  averageScore: number
  timeSpent: string
  totalTimeSpentSeconds: number
  points: number
  badges: Badge[]
  thisWeekQuizzes: number
  thisMonthQuizzes: number
  dailyScores: DailyScore[]
}