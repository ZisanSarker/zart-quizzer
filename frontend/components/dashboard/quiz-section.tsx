"use client"

import Link from "next/link"
import { GradientButton } from "@/components/ui/gradient-button"
import { Section } from "@/components/section"
import { QuizCard } from "./quiz-card"
import { EmptyState } from "./empty-state"
import { StaggerChildren } from "@/components/animations/motion"
import { Trophy, Brain, ArrowRight } from "lucide-react"
import type { RecentQuizAttempt, RecommendedQuiz } from "@/types/quiz"

interface QuizSectionProps {
  title: string
  description: string
  quizzes: RecentQuizAttempt[] | RecommendedQuiz[]
  type: "recent" | "recommended"
  emptyStateIcon: any
  emptyStateTitle: string
  emptyStateDescription: string
  emptyStateActionText?: string
  emptyStateActionHref?: string
  emptyStateActionIcon?: any
  viewAllText?: string
  viewAllHref?: string
  viewAllIcon?: any
}

export function QuizSection({
  title,
  description,
  quizzes,
  type,
  emptyStateIcon: EmptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateActionText,
  emptyStateActionHref,
  emptyStateActionIcon: EmptyStateActionIcon,
  viewAllText,
  viewAllHref,
  viewAllIcon: ViewAllIcon
}: QuizSectionProps) {
  const displayedQuizzes = quizzes.slice(0, 3)

  return (
    <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Quizzes Grid */}
          {displayedQuizzes.length > 0 ? (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id || quiz._id}
                  id={quiz.id || quiz._id}
                  title={quiz.quizTitle || quiz.title}
                  score={type === "recent" ? (quiz as RecentQuizAttempt).score : undefined}
                  totalQuestions={type === "recent" ? (quiz as RecentQuizAttempt).totalQuestions : undefined}
                  correctAnswers={type === "recent" ? (quiz as RecentQuizAttempt).correctAnswers : undefined}
                  date={type === "recent" ? (quiz as RecentQuizAttempt).date : undefined}
                  difficulty={type === "recommended" ? (quiz as RecommendedQuiz).difficulty : undefined}
                  author={type === "recommended" ? (quiz as RecommendedQuiz).author : undefined}
                  averageRating={type === "recommended" ? (quiz as RecommendedQuiz).averageRating : undefined}
                  status={type === "recent" ? "completed" : "recommended"}
                  actionText={type === "recent" ? "View Result" : "Practice"}
                  actionHref={type === "recent" 
                    ? `/dashboard/quiz/result/${quiz.id || quiz._id}`
                    : `/dashboard/quiz/practice/${quiz.id || quiz._id}`
                  }
                />
              ))}
            </StaggerChildren>
          ) : (
            <EmptyState
              icon={EmptyStateIcon}
              title={emptyStateTitle}
              description={emptyStateDescription}
              actionText={emptyStateActionText}
              actionHref={emptyStateActionHref}
              actionIcon={EmptyStateActionIcon}
            />
          )}

          {/* View All Button */}
          {displayedQuizzes.length > 0 && viewAllText && viewAllHref && (
            <div className="text-center pt-6">
              <GradientButton asChild variant="outline">
                <Link href={viewAllHref}>
                  {ViewAllIcon && <ViewAllIcon className="mr-2 h-4 w-4" />}
                  {viewAllText}
                </Link>
              </GradientButton>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
} 