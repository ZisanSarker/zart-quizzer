"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getRecentQuizAttempts, getRecommendedQuizzes } from "@/lib/quiz"
import { getMyStats } from "@/lib/stats"
import type { RecentQuizAttempt, RecommendedQuiz } from "@/types/quiz"
import type { UserStats } from "@/types/stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, CheckCircle, BarChart3, Clock, Plus, Trophy, ArrowRight } from "lucide-react"
import { GradientButton } from "@/components/ui/gradient-button"
import { StaggerChildren, StaggerItem, FadeUp, AnimatedCounter } from "@/components/animations/motion"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuizAttempt[]>([])
  const [recommendedQuizzes, setRecommendedQuizzes] = useState<RecommendedQuiz[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [quizError, setQuizError] = useState<string | null>(null)

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      setStatsError(null)
      try {
        const data = await getMyStats()
        setStats(data)
      } catch (error: any) {
        setStatsError("Failed to fetch statistics.")
      }
    }
    if (user) {
      fetchStats()
    }
  }, [user])

  // Fetch quizzes
  useEffect(() => {
    const fetchData = async () => {
      setQuizError(null)
      try {
        console.log('🔍 Fetching dashboard data for user:', user?._id)
        const [recent, recommended] = await Promise.all([
          getRecentQuizAttempts(),
          getRecommendedQuizzes(),
        ])
        console.log('📊 Dashboard data fetched:', { 
          recent: recent.length, 
          recommended: recommended.length,
          recentData: recent,
          recommendedData: recommended
        })
        setRecentQuizzes(recent)
        setRecommendedQuizzes(recommended)
      } catch (error: any) {
        console.error('❌ Failed to fetch dashboard data:', error)
        setQuizError("Failed to fetch dashboard data.")
      }
    }
    if (user) {
      console.log('👤 User authenticated, fetching quiz data...')
      fetchData()
    } else {
      console.log('❌ User not authenticated, skipping quiz data fetch')
    }
  }, [user])

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

  const statsArray = [
    { title: "Quizzes Created", value: stats?.quizzesCreated ?? 0, icon: Brain },
    { title: "Quizzes Completed", value: stats?.quizzesCompleted ?? 0, icon: CheckCircle },
    { title: "Average Score", value: stats?.averageScore ?? 0, icon: BarChart3, isPercentage: true },
    { title: "Time Spent", value: stats?.timeSpent ?? "--", icon: Clock, isTime: true },
  ]

  // Only show at most 5 recent/recommended quizzes
  const displayedRecentQuizzes = recentQuizzes.slice(0, 5)
  const displayedRecommendedQuizzes = recommendedQuizzes.slice(0, 5)

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 w-full">
        <h1 className="responsive-heading-1 gradient-heading">Dashboard</h1>
        <GradientButton asChild className="w-full sm:w-auto touch-target">
          <Link href="/dashboard/create">
            <Plus className="mr-2 h-4 w-4" /> Create Quiz
          </Link>
        </GradientButton>
      </div>

      {/* Enhanced responsive stats grid */}
      <StaggerChildren className="w-full responsive-grid-4">
        {statsArray.map((stat, i) => (
          <StaggerItem key={i}>
            <Card className="card-hover mobile-card">
              <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-primary-100 p-2 sm:p-3 mb-3 sm:mb-4">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold">
                  {stat.isTime ? (
                    stat.value
                  ) : stat.isPercentage ? (
                    <>
                      <AnimatedCounter value={stat.value} />%
                    </>
                  ) : (
                    <AnimatedCounter value={stat.value as number} />
                  )}
                </div>
                <p className="responsive-text-small text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerChildren>
      
      {/* Stats error display */}
      {statsError && (
        <div className="w-full text-red-500 text-center py-4">{statsError}</div>
      )}

      {/* Quiz Error display */}
      {quizError && (
        <div className="w-full text-red-500 text-center py-4">{quizError}</div>
      )}

      {/* Enhanced responsive content grid */}
      <div className="w-full responsive-grid-2 mt-6">
        <FadeUp delay={0.3}>
          <Card className="card-hover mobile-card">
            <CardHeader className="mobile-card-header">
              <CardTitle className="gradient-heading responsive-heading-3">Recent Quizzes</CardTitle>
              <CardDescription className="responsive-text-small">Your recently completed quizzes</CardDescription>
            </CardHeader>
            <CardContent className="mobile-card-content">
              <div className="space-y-3 sm:space-y-4">
                {displayedRecentQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg transition-all duration-300 hover:text-primary-500 hover:outline hover:shadow-sm touch-target"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="rounded-full bg-primary-100 p-2 flex-shrink-0">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium responsive-text-small truncate">{quiz.title}</div>
                        <div className="responsive-text-small text-muted-foreground">{quiz.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span className="responsive-text-small">{quiz.score}%</span>
                      </div>
                      <Button variant="ghost" size="icon" className="hover:text-primary transition-colors touch-target" asChild>
                        <Link href={`/dashboard/history/${quiz.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                {displayedRecentQuizzes.length === 0 && (
                  <div className="text-muted-foreground text-center py-8 responsive-text-small">No recent quizzes yet.</div>
                )}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="transition-all duration-300 hover:border-primary-300 touch-target" asChild>
                  <Link href="/dashboard/history">View All History</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.4}>
          <Card className="card-hover mobile-card">
            <CardHeader className="mobile-card-header">
              <CardTitle className="gradient-heading responsive-heading-3">Recommended Quizzes</CardTitle>
              <CardDescription className="responsive-text-small">Quizzes you might be interested in</CardDescription>
            </CardHeader>
            <CardContent className="mobile-card-content">
              <div className="space-y-3 sm:space-y-4">
                {displayedRecommendedQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg transition-all duration-300 hover:text-primary-500 hover:outline hover:shadow-sm touch-target"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="rounded-full bg-primary-100 p-2 flex-shrink-0">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium responsive-text-small truncate">{quiz.title}</div>
                        <div className="responsive-text-small text-muted-foreground">
                          By {quiz.author} • {quiz.difficulty}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="hover:text-primary transition-colors touch-target flex-shrink-0" asChild>
                      <Link href={`/dashboard/practice/${quiz.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
                {displayedRecommendedQuizzes.length === 0 && (
                  <div className="text-muted-foreground text-center py-8 responsive-text-small">No recommendations yet.</div>
                )}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="transition-all duration-300 hover:border-primary-300 touch-target" asChild>
                  <Link href="/explore">Explore More Quizzes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </div>
    </div>
  )
}