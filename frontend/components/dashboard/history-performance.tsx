"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PerformanceData {
  topic: string
  attempts: number
  averageScore: number
}

interface RecentProgressData {
  id: string
  quizTitle: string
  score: number
  completedAt: string
}

interface HistoryPerformanceProps {
  performanceByTopic: PerformanceData[]
  recentProgress: RecentProgressData[]
}

export function HistoryPerformance({ performanceByTopic, recentProgress }: HistoryPerformanceProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Performance by Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceByTopic.map((item) => (
              <div key={item.topic} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{item.topic}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.attempts} attempts
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${item.averageScore}%` }}
                  ></div>
                </div>
                <div className="text-sm text-right">
                  {item.averageScore}% average
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentProgress.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    item.score >= 90
                      ? "bg-green-500"
                      : item.score >= 70
                      ? "bg-primary"
                      : item.score >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  } text-white flex-shrink-0`}
                >
                  <span className="text-sm font-bold">{item.score}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {item.quizTitle}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(item.completedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 