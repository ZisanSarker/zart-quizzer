"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { StaggerItem } from "@/components/animations/motion"
import type { RecentQuizAttempt } from "@/types/quiz"

interface HistoryItemProps {
  quiz: RecentQuizAttempt
}

// Helper: get score badge color
const getScoreBadgeColor = (score: number) => {
  if (score >= 90) return "bg-green-500 hover:bg-green-600";
  if (score >= 70) return "bg-primary hover:bg-primary/90";
  if (score >= 50) return "bg-yellow-500 hover:bg-yellow-600";
  return "bg-red-500 hover:bg-red-600";
};

// Helper: relative date string
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

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

export function HistoryItem({ quiz }: HistoryItemProps) {
  return (
    <StaggerItem>
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300 truncate">
                {quiz.quizTitle}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {formatRelativeTime(quiz.completedAt)}
              </p>
            </div>
            <Badge className={`${getScoreBadgeColor(quiz.score)} text-white`}>
              {quiz.score}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">
                {quiz.totalQuestions}
              </div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">
                {quiz.correctAnswers}
              </div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Time: {formatTimeTaken(quiz.timeTaken)}</span>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="group-hover:border-primary/50 group-hover:text-primary transition-colors duration-300"
            >
              <Link href={`/dashboard/quiz/result/${quiz.id}`}>
                <ArrowRight className="h-3 w-3 mr-1" />
                View Result
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </StaggerItem>
  )
} 