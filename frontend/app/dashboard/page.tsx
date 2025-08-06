"use client"

import { useDashboardData } from "@/hooks/use-dashboard-data"
import { DashboardHeader, StatsGrid, QuizSection, MotivationSection } from "@/components/dashboard"
import { Plus, Brain, Trophy, ArrowRight } from "lucide-react"

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

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-96">
        <span className="text-lg text-muted-foreground">Loading...</span>
      </div>
    )
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

      {/* Modern animated stats grid */}
      <StatsGrid stats={stats} />

      {/* Motivation Section */}
      <MotivationSection stats={stats} />

      {/* Recent Quizzes Section */}
      <QuizSection
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
      <QuizSection
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