"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StaggerItem } from "@/components/animations/motion"
import { ArrowRight } from "lucide-react"

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
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return { color: "bg-green-500", text: "Completed" }
      case "recommended":
        return { color: "bg-blue-500", text: "Recommended" }
      case "created":
        return { color: "bg-purple-500", text: "Created" }
      default:
        return { color: "bg-gray-500", text: "Unknown" }
    }
  }

  const statusConfig = getStatusConfig()

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
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                {title}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <div className={`w-2 h-2 ${statusConfig.color} rounded-full`}></div>
              <span className="text-xs text-muted-foreground">{statusConfig.text}</span>
            </div>
          </div>

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
          <div className="grid grid-cols-2 gap-4 mb-4">
            {totalQuestions !== undefined && (
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {totalQuestions}
                </div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
            )}
            {correctAnswers !== undefined && (
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {correctAnswers}
                </div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
            )}
            {averageRating !== undefined && (
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            )}
            {averageRating !== undefined && (
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  ⭐
                </div>
                <div className="text-xs text-muted-foreground">Stars</div>
              </div>
            )}
          </div>

          {/* Quiz Actions */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground truncate">
                {date || (status === "recommended" ? "Recommended for you" : "")}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="group-hover:border-primary/50 group-hover:text-primary transition-colors duration-300"
              >
                <Link href={actionHref}>
                  <ArrowRight className="h-3 w-3 mr-1" />
                  {actionText || "View"}
                </Link>
              </Button>
            </div>
          </div>

          {/* Floating particles effect */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
      </Card>
    </StaggerItem>
  )
} 