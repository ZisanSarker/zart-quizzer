"use client"

import { Suspense } from "react"
import { useExploreData } from "@/hooks/use-explore-data"
import { ExploreHeader } from "@/components/explore/explore-header"
import { LazyExploreContent } from "@/components/lazy-components"
import { usePerformanceOptimization } from "@/hooks/use-performance-optimization"
import { useEffect } from "react"

// Format date to relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "Yesterday"
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

export default function ExplorePage() {
  const {
    isLoading,
    savingQuizId,
    activeTab,
    currentPage,
    totalPages,
    pagedQuizzes,
    handleSaveQuiz,
    handlePageChange,
    handleTabChange
  } = useExploreData()

  const { prefetchRoute } = usePerformanceOptimization()

  // Prefetch likely routes from explore
  useEffect(() => {
    prefetchRoute('/dashboard')
    prefetchRoute('/dashboard/create')
    prefetchRoute('/dashboard/library')
  }, [prefetchRoute])

  return (
    <div className="w-full flex flex-col items-center">
      <ExploreHeader />
      <Suspense fallback={<div className="w-full h-96 bg-muted rounded animate-pulse" />}>
        <LazyExploreContent
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isLoading={isLoading}
          pagedQuizzes={pagedQuizzes}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSave={handleSaveQuiz}
          savingQuizId={savingQuizId}
          formatRelativeTime={formatRelativeTime}
        />
      </Suspense>
    </div>
  )
}