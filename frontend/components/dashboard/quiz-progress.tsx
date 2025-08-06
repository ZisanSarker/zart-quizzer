"use client"

import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

interface QuizProgressProps {
  currentQuestion: number
  totalQuestions: number
  timeLeft?: number
  timeLimit?: boolean
}

export function QuizProgress({ 
  currentQuestion, 
  totalQuestions, 
  timeLeft, 
  timeLimit 
}: QuizProgressProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
      </div>
      {timeLimit && timeLeft !== undefined && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className={`text-sm font-medium ${timeLeft <= 5 ? "text-red-500 animate-pulse" : ""}`}>
            {timeLeft}s
          </span>
        </div>
      )}
    </div>
  )
} 