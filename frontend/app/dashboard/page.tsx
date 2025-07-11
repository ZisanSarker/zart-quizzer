"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Brain, CheckCircle, Clock, Plus, Trophy } from "lucide-react"
import { AnimatedCounter, FadeUp, StaggerChildren, StaggerItem } from "@/components/animations/motion"
import { getRecentQuizAttempts, getRecommendedQuizzes } from "@/lib/quiz"
import { getMyStats } from "@/lib/stats"
import type { RecentQuizAttempt, RecommendedQuiz } from "@/types/quiz"
import type { UserStats } from "@/types/stats"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuizAttempt[]>([])
  const [recommendedQuizzes, setRecommendedQuizzes] = useState<RecommendedQuiz[]>([])
  const [quizError, setQuizError] = useState<string | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  // Fetch stats
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
        const [recent, recommended] = await Promise.all([
          getRecentQuizAttempts(),
          getRecommendedQuizzes(),
        ])
        setRecentQuizzes(recent)
        setRecommendedQuizzes(recommended)
      } catch (error: any) {
        setQuizError("Failed to fetch dashboard data.")
      }
    }
    if (user) {
      fetchData()
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
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">Dashboard</h1>
        <GradientButton asChild>
          <Link href="/dashboard/create">
            <Plus className="mr-2 h-4 w-4" /> Create Quiz
          </Link>
        </GradientButton>
      </div>

      {/* Stats */}
      <StaggerChildren className="w-full grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        {statsArray.map((stat, i) => (
          <StaggerItem key={i}>
            <Card className="card-hover">
              <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-primary-100 p-3 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold">
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
                <p className="text-sm text-muted-foreground">{stat.title}</p>
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

      <div className="w-full grid gap-4 sm:gap-6 mt-6 grid-cols-1 md:grid-cols-2">
        <FadeUp delay={0.3}>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="gradient-heading">Recent Quizzes</CardTitle>
              <CardDescription>Your recently completed quizzes</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="space-y-4">
                {displayedRecentQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg transition-all duration-300 hover:text-primary-500 hover:outline hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary-100 p-2">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{quiz.title}</div>
                        <div className="text-sm text-muted-foreground">{quiz.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span>{quiz.score}%</span>
                      </div>
                      <Button variant="ghost" size="icon" className="hover:text-primary transition-colors" asChild>
                        <Link href={`/dashboard/history/${quiz.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                {displayedRecentQuizzes.length === 0 && (
                  <div className="text-muted-foreground text-center py-8">No recent quizzes yet.</div>
                )}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="transition-all duration-300 hover:border-primary-300" asChild>
                  <Link href="/dashboard/history">View All History</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.4}>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="gradient-heading">Recommended Quizzes</CardTitle>
              <CardDescription>Quizzes you might be interested in</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="space-y-4">
                {displayedRecommendedQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg transition-all duration-300 hover:text-primary-500 hover:outline hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary-100 p-2">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{quiz.title}</div>
                        <div className="text-sm text-muted-foreground">
                          By {quiz.author} • {quiz.difficulty}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="hover:text-primary transition-colors" asChild>
                      <Link href={`/dashboard/practice/${quiz.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
                {displayedRecommendedQuizzes.length === 0 && (
                  <div className="text-muted-foreground text-center py-8">No recommendations yet.</div>
                )}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="transition-all duration-300 hover:border-primary-300" asChild>
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