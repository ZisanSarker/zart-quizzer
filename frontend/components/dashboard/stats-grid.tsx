"use client"

import { Brain, Clock } from "lucide-react"
import { StatsCard } from "./stats-card"
import { Section } from "@/components/section"
import { StaggerChildren } from "@/components/animations/motion"
import { 
  CompletedQuizzesCard, 
  AverageScoreCard 
} from "./stats-grid/index"
import type { UserStats } from "@/types/stats"

interface StatsGridProps {
  stats: UserStats | null
}

export function StatsGrid({ stats }: StatsGridProps) {
  const completedQuizzes = stats?.quizzesCompleted ?? 0
  const attemptedQuizzes = stats?.quizzesAttempted ?? 0
  const averageScore = stats?.averageScore ?? 0

  // Chart data for Average Score performance over 1 week
  const scoreChartData = stats?.dailyScores ?? [
    { day: 'Mon', score: 0, target: 85, aboveTarget: false },
    { day: 'Tue', score: 0, target: 85, aboveTarget: false },
    { day: 'Wed', score: 0, target: 85, aboveTarget: false },
    { day: 'Thu', score: 0, target: 85, aboveTarget: false },
    { day: 'Fri', score: 0, target: 85, aboveTarget: false },
    { day: 'Sat', score: 0, target: 85, aboveTarget: false },
    { day: 'Sun', score: 0, target: 85, aboveTarget: false },
  ]

  return (
    <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <StaggerChildren className="space-y-4 sm:space-y-6">
          {/* First Row - 30% Quizzes Created / 70% Quizzes Completed */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6">
            {/* Quizzes Created - 30% */}
            <div className="lg:col-span-3">
              <StatsCard
                title="Quizzes Created"
                value={stats?.quizzesCreated ?? 0}
                icon={Brain}
                subtitle="Your creation activity"
              >
                {/* Additional Stats */}
                <div className="space-y-3 flex-1">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">This Week</span>
                      <span className="text-xs font-medium text-primary">+{stats?.thisWeekQuizzes ?? 0}</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">This Month</span>
                      <span className="text-xs font-medium text-primary">+{stats?.thisMonthQuizzes ?? 0}</span>
                    </div>
                  </div>
                </div>
              </StatsCard>
            </div>

            {/* Quizzes Completed - 70% */}
            <div className="lg:col-span-7">
              <CompletedQuizzesCard 
                completedQuizzes={completedQuizzes}
                attemptedQuizzes={attemptedQuizzes}
              />
            </div>
          </div>

          {/* Second Row - 70% Average Score / 30% Time Spent */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6">
            {/* Average Score - 70% */}
            <div className="lg:col-span-7">
              <AverageScoreCard 
                averageScore={averageScore}
                scoreChartData={scoreChartData}
              />
            </div>

            {/* Time Spent - 30% */}
            <div className="lg:col-span-3">
              <StatsCard
                title="Time Spent"
                value={stats?.timeSpent ?? "0h"}
                icon={Clock}
                subtitle="Learning duration"
                isTime={true}
              >
                {/* Additional Stats */}
                <div className="space-y-2 flex-1">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">This Week</span>
                      <span className="text-xs font-medium text-primary">2.5h</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">This Month</span>
                      <span className="text-xs font-medium text-primary">8.5h</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Avg/Day</span>
                      <span className="text-xs font-medium text-primary">0.5h</span>
                    </div>
                  </div>
                </div>
              </StatsCard>
            </div>
          </div>
        </StaggerChildren>
      </div>
    </Section>
  )
} 