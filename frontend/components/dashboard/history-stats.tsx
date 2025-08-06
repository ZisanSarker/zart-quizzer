"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Calendar, Clock, Trophy } from "lucide-react"
import { StaggerChildren, StaggerItem } from "@/components/animations/motion"
import type { RecentQuizAttempt } from "@/types/quiz"

interface HistoryStatsProps {
  quizHistory: RecentQuizAttempt[]
}

// Helper to format seconds into "Xh Ym Zs"
function formatTimeTaken(time: number | string | "N/A") {
  if (typeof time === "number" && !isNaN(time)) {
    if (time <= 0) return "N/A";
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;
    return [h ? `${h}h` : null, m ? `${m}m` : null, s ? `${s}s` : null]
      .filter(Boolean)
      .join(" ");
  }
  if (typeof time === "string" && time !== "N/A") {
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(time)) return time;
  }
  return "N/A";
}

export function HistoryStats({ quizHistory }: HistoryStatsProps) {
  const totalQuizzes = quizHistory.length;
  const averageScore = totalQuizzes > 0 
    ? Math.round(quizHistory.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / totalQuizzes)
    : 0;
  const totalTime = quizHistory.reduce((sum, quiz) => {
    const time = typeof quiz.timeTaken === 'number' ? quiz.timeTaken : 0;
    return sum + time;
  }, 0);
  const perfectScores = quizHistory.filter(quiz => quiz.score === 100).length;

  return (
    <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StaggerItem>
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">
              Quizzes completed
            </p>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTimeTaken(totalTime)}</div>
            <p className="text-xs text-muted-foreground">
              Time spent learning
            </p>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfect Scores</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{perfectScores}</div>
            <p className="text-xs text-muted-foreground">
              100% achievements
            </p>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerChildren>
  )
} 