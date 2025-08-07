"use client"

import { Card } from "@/components/ui/card"
import { StaggerItem } from "@/components/animations/motion"
import { 
  QuizCardHeader, 
  QuizCardStats, 
  QuizCardActions 
} from "./quiz-card/index"

interface QuizCardProps {
  id: string
  title: string
  score?: number
  totalQuestions?: number
  correctAnswers?: number
  date?: string
  difficulty?: string
  author?: string
  averageRating?: number
  status?: "completed" | "recommended" | "created"
  actionText?: string
  actionHref: string
  className?: string
}

export function QuizCard({
  id,
  title,
  score,
  totalQuestions,
  correctAnswers,
  date,
  difficulty,
  author,
  averageRating,
  status = "completed",
  actionText,
  actionHref,
  className = ""
}: QuizCardProps) {
  return (
    <StaggerItem>
      <Card className={`group relative overflow-hidden hover:shadow-lg transition-all duration-300 h-80 ${className}`}>
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-lg border border-white/20 group-hover:border-primary/30 transition-all duration-500"></div>
        
        {/* Animated border gradient */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
        
        {/* Card Content */}
        <div className="relative p-6 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 h-full flex flex-col">
          {/* Quiz Header */}
          <QuizCardHeader title={title} status={status} />

          {/* Score or Difficulty Display */}
          {score !== undefined && (
            <div className="mb-2">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                Score: {score}%
              </span>
            </div>
          )}

          {difficulty && (
            <div className="mb-2">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {difficulty}
              </span>
            </div>
          )}

          {/* Author */}
          {author && (
            <div className="mb-4 flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2">
                By {author}
              </p>
            </div>
          )}

          {/* Quiz Stats */}
          <QuizCardStats 
            totalQuestions={totalQuestions}
            correctAnswers={correctAnswers}
            averageRating={averageRating}
          />

          {/* Quiz Actions */}
          <QuizCardActions 
            date={date}
            status={status}
            actionText={actionText}
            actionHref={actionHref}
          />

          {/* Floating particles effect */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
      </Card>
    </StaggerItem>
  )
} 