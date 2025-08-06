"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HistoryStatsCardsProps {
  quizHistory: any[]
  performanceByTopic: any[]
}

export function HistoryStatsCards({ quizHistory, performanceByTopic }: HistoryStatsCardsProps) {
  const calculateAverageScore = () => {
    const validScores = quizHistory
      .map((item) => Number(item.score))
      .filter((score) => !isNaN(score) && score >= 0 && score <= 100)
    return validScores.length > 0
      ? Math.round(validScores.reduce((acc, score) => acc + score, 0) / validScores.length)
      : 0
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 mb-6">
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Quizzes Taken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{quizHistory.length}</div>
        </CardContent>
      </Card>
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Average Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {calculateAverageScore()}%
          </div>
        </CardContent>
      </Card>
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Topics Covered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {performanceByTopic.length}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 