"use client"

import { useDashboardData } from "@/hooks/use-dashboard-data"
import { DashboardHeader } from "@/components/dashboard"
import { Plus, Brain, Trophy, ArrowRight } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/feedback"
import { LazyStatsGrid, LazyQuizSection, LazyMotivationSection } from "@/components/lazy-components"
import { usePerformanceOptimization } from "@/hooks/use-performance-optimization"
import { useEffect } from "react"

export default function DashboardPage() {
  const {
    user,
    isLoading,
    recentQuizzes,
    recommendedQuizzes,
    stats,
    statsError,
    quizError,
    isLoadingData
  } = useDashboardData()
  
  const { prefetchRoute } = usePerformanceOptimization()

  // Prefetch likely routes from dashboard
  useEffect(() => {
    prefetchRoute('/dashboard/create')
    prefetchRoute('/dashboard/library')
    prefetchRoute('/dashboard/profile')
    prefetchRoute('/dashboard/settings')
    prefetchRoute('/explore')
  }, [prefetchRoute])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Dashboard Header Section */}
      <DashboardHeader
        title="Dashboard"
        actionText="Create Quiz"
        actionHref="/dashboard/create"
        actionIcon={Plus}
      />

      {/* Stats Grid */}
      <LazyStatsGrid stats={stats} />

      {/* Motivation Section */}
      <LazyMotivationSection stats={stats} />

      {/* Recent Quizzes Section */}
      <LazyQuizSection
        title="Your Recent Quizzes"
        description="Track your latest quiz creations and their performance"
        quizzes={recentQuizzes}
        type="recent"
        emptyStateIcon={Brain}
        emptyStateTitle="No Quizzes Yet"
        emptyStateDescription="Start creating your first quiz to see it here"
        emptyStateActionText="Create Your First Quiz"
        emptyStateActionHref="/dashboard/create"
        emptyStateActionIcon={Plus}
        viewAllText="View All Quizzes"
        viewAllHref="/dashboard/library"
        viewAllIcon={Trophy}
      />

      {/* Recommended Quizzes Section */}
      <LazyQuizSection
        title="Recommended for You"
        description="Discover quizzes tailored to your interests and learning goals"
        quizzes={recommendedQuizzes}
        type="recommended"
        emptyStateIcon={Trophy}
        emptyStateTitle="No Recommendations Yet"
        emptyStateDescription="Complete more quizzes to get personalized recommendations"
        emptyStateActionText="Explore Quizzes"
        emptyStateActionHref="/explore"
        emptyStateActionIcon={ArrowRight}
        viewAllText="View All Recommendations"
        viewAllHref="/explore"
        viewAllIcon={ArrowRight}
      />
    </div>
  )
}