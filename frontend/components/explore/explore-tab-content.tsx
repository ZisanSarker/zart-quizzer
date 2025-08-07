"use client"

import { ExploreQuizCard } from "./explore-quiz-card"
import { ExploreSkeleton } from "./explore-skeleton"
import { ExploreEmptyState } from "./explore-empty-state"
import { ExplorePagination } from "./explore-pagination"
import type { ExploreQuiz } from "@/types/quiz"

interface ExploreTabContentProps {
  isLoading: boolean
  pagedQuizzes: ExploreQuiz[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  onSave: (id: string) => void
  savingQuizId: string | null
  formatRelativeTime: (date: string) => string
}

export function ExploreTabContent({
  isLoading,
  pagedQuizzes,
  totalPages,
  currentPage,
  onPageChange,
  onSave,
  savingQuizId,
  formatRelativeTime
}: ExploreTabContentProps) {
  if (isLoading) {
    return <ExploreSkeleton />
  }

  if (pagedQuizzes.length === 0) {
    return <ExploreEmptyState />
  }

  return (
    <>
      {pagedQuizzes.map((quiz) => (
        <ExploreQuizCard
          key={quiz._id}
          quiz={quiz}
          onSave={onSave}
          saving={savingQuizId === quiz._id}
          formatRelativeTime={formatRelativeTime}
        />
      ))}
      <ExplorePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  )
} 