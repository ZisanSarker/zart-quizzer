"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { DashboardHeader } from "@/components/dashboard"
import { Plus, Brain, Trophy, ArrowRight } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/feedback"
import { LazyStatsGrid, LazyQuizSection, LazyMotivationSection } from "@/components/lazy-components"
import { preloadDashboardRoutes } from "@/lib/route-preloader"

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
  
  const router = useRouter()

  // Prefetch likely routes from dashboard
  useEffect(() => {
    preloadDashboardRoutes(router)
  }, [router])

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
      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map(i => (<div key={i} className="h-32 bg-muted rounded animate-pulse" />))}
      </div>}>
        <LazyStatsGrid stats={stats} />
      </Suspense>

      {/* Motivation Section */}
      <Suspense fallback={<div className="h-32 bg-muted rounded animate-pulse w-full mt-6" />}>
        <LazyMotivationSection stats={stats} />
      </Suspense>

      {/* Recent Quizzes Section */}
      <Suspense fallback={<div className="space-y-4 w-full mt-6">
        <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (<div key={i} className="h-48 bg-muted rounded animate-pulse" />))}
        </div>
      </div>}>
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
      </Suspense>

      {/* Recommended Quizzes Section */}
      <Suspense fallback={<div className="space-y-4 w-full mt-6">
        <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (<div key={i} className="h-48 bg-muted rounded animate-pulse" />))}
        </div>
      </div>}>
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
      </Suspense>
    </div>
  )
}