"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard-layout"
import { ArrowRight, BarChart3, Brain, CheckCircle, Clock, Plus, Trophy } from "lucide-react"
import { AnimatedCounter, FadeUp, StaggerChildren, StaggerItem } from "@/components/animations/motion"
import { getRecentQuizAttempts, getRecommendedQuizzes } from "@/lib/quiz"
import type { RecentQuizAttempt, RecommendedQuiz } from "@/types/quiz"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const stats = [
    { title: "Quizzes Created", value: 12, icon: Brain },
    { title: "Quizzes Completed", value: 28, icon: CheckCircle },
    { title: "Average Score", value: 76, icon: BarChart3, isPercentage: true },
    { title: "Time Spent", value: "8h 24m", icon: Clock, isTime: true },
  ]

  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuizAttempt[]>([])
  const [recommendedQuizzes, setRecommendedQuizzes] = useState<RecommendedQuiz[]>([])
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Explicitly redirect if not loading and not authenticated (defensive, in addition to middleware)
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recent, recommended] = await Promise.all([
          getRecentQuizAttempts(),
          getRecommendedQuizzes(),
        ])
        setRecentQuizzes(recent)
        setRecommendedQuizzes(recommended)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      }
    }

    // Only fetch if authenticated
    if (user) {
      fetchData()
    }
  }, [user])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="w-full flex items-center justify-center h-96">
          <span className="text-lg text-muted-foreground">Loading...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    // Defensive, in case middleware fails
    return null
  }

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 w-full">
          <h1 className="text-3xl font-bold tracking-tight gradient-heading">Dashboard</h1>
          <GradientButton asChild>
            <Link href="/dashboard/create">
              <Plus className="mr-2 h-4 w-4" /> Create Quiz
            </Link>
          </GradientButton>
        </div>

        <StaggerChildren className="w-full grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
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

        <div className="w-full grid gap-4 sm:gap-6 mt-6 grid-cols-1 md:grid-cols-2">
          <FadeUp delay={0.3}>
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="gradient-heading">Recent Quizzes</CardTitle>
                <CardDescription>Your recently completed quizzes</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="space-y-4">
                  {recentQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg transition-all duration-300 hover:bg-primary-50 hover:shadow-sm"
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
                  {recentQuizzes.length === 0 && (
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
                  {recommendedQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg transition-all duration-300 hover:bg-primary-50 hover:shadow-sm"
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
                  {recommendedQuizzes.length === 0 && (
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
    </DashboardLayout>
  )
}