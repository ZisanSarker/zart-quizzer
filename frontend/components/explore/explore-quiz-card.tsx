"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { OptimizedAvatar } from "@/components/ui/optimized-avatar"
import { Brain, Clock, Star, Users } from "lucide-react"
import type { ExploreQuiz } from "@/types/quiz"

interface ExploreQuizCardProps {
  quiz: ExploreQuiz
  onSave: (id: string) => void
  saving: boolean
  formatRelativeTime: (date: string) => string
}

export function ExploreQuizCard({ 
  quiz, 
  onSave, 
  saving, 
  formatRelativeTime 
}: ExploreQuizCardProps) {
  const difficultyMap: Record<string, string> = {
    easy: "Beginner",
    medium: "Intermediate",
    hard: "Advanced",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }
  const uiDifficulty = difficultyMap[(quiz.difficulty || "").toLowerCase()] || quiz.difficulty

  return (
    <Card className="card-hover mobile-card">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              <div className="min-w-0 flex-1">
                <Link href={`/dashboard/quiz/practice/${quiz._id}`} className="hover:text-primary transition-colors">
                  <h3 className="responsive-heading-3 hover:underline truncate">{quiz.topic}</h3>
                </Link>
                <p className="responsive-text-small text-muted-foreground mt-1 line-clamp-2">{quiz.description}</p>
              </div>
              <Badge
                variant={
                  uiDifficulty === "Beginner"
                    ? "outline"
                    : uiDifficulty === "Intermediate"
                      ? "secondary"
                      : "default"
                }
                className="flex-shrink-0 self-start sm:self-auto"
              >
                {uiDifficulty}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
              {(quiz.tags || []).map((tag) => (
                <Badge key={tag} variant="outline" className="bg-muted/50 responsive-text-small text-xs sm:text-sm">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 mt-3 sm:mt-4">
              <div 
                className="metric-badge metric-badge-blue flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full group relative" 
                title={`${quiz.questions.length} question${quiz.questions.length === 1 ? '' : 's'} in this quiz`}
              >
                <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                  {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}
                </span>
              </div>
              
              <div 
                className="metric-badge metric-badge-green flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full group relative" 
                title={`${quiz.attempts ?? 0} user${quiz.attempts === 1 ? '' : 's'} have attempted this quiz`}
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">{quiz.attempts ?? 0} attempts</span>
              </div>
              
              <div 
                className="metric-badge metric-badge-purple flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full group relative" 
                title={`Created ${formatRelativeTime(quiz.createdAt)}`}
              >
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300">{formatRelativeTime(quiz.createdAt)}</span>
              </div>
              
              <div 
                className="metric-badge metric-badge-amber flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full group relative" 
                title={`Average rating: ${quiz.rating ? quiz.rating.toFixed(1) : "0.0"}/5.0`}
              >
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300">{quiz.rating ? quiz.rating.toFixed(1) : "0.0"}</span>
              </div>
              
              <div 
                className="metric-badge metric-badge-orange flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full group relative" 
                title={`${quiz.ratingCount ?? 0} user${quiz.ratingCount === 1 ? '' : 's'} rated this quiz`}
              >
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-orange-600 dark:bg-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xs font-bold text-white">{quiz.ratingCount ?? 0}</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300">{quiz.ratingCount === 1 ? "rating" : "ratings"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end gap-3 sm:gap-4 lg:min-w-0">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="text-sm text-right min-w-0 flex-1 lg:flex-none">
                <Link 
                  href={`/dashboard/profile/${quiz.author?._id || 'unknown'}`}
                  className="group hover:text-primary transition-colors duration-200 author-link"
                >
                  <p className="font-medium responsive-text-small truncate group-hover:underline">
                    {quiz.author?.name || "Unknown Author"}
                  </p>
                  <p className="responsive-text-small text-muted-foreground group-hover:text-primary/70 transition-colors duration-200">
                    Author
                  </p>
                </Link>
              </div>
              <Link 
                href={`/dashboard/profile/${quiz.author?._id || 'unknown'}`}
                className="flex-shrink-0 group"
              >
                <OptimizedAvatar
                  src={quiz.author?.avatar || "/placeholder.svg"}
                  alt={quiz.author?.name || "Author"}
                  size="sm"
                  fallbackText={quiz.author?.initials || "?"}
                  className="group-hover:scale-105 transition-transform duration-200 group-hover:ring-2 group-hover:ring-primary/20 author-avatar-hover h-8 w-8 sm:h-10 sm:w-10"
                />
              </Link>
            </div>

            <div className="flex gap-2 w-full lg:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSave(quiz._id)}
                disabled={saving}
                className="flex-1 lg:flex-none touch-target min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button asChild className="flex-1 lg:flex-none touch-target min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm">
                <Link href={`/dashboard/quiz/practice/${quiz._id}`}>Practice</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 