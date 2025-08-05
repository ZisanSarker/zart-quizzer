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
import { Section } from "@/components/section"
import Link from "next/link"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

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

  // Pie chart data for attempted vs completed quizzes
  const completedQuizzes = stats?.quizzesCompleted ?? 0;
  const attemptedQuizzes = Math.max(completedQuizzes * 1.5, completedQuizzes + 1); // Ensure we have some attempted quizzes
  
  const pieChartData = [
    { name: 'Completed', value: completedQuizzes, color: '#8b5cf6' },
    { name: 'Attempted', value: attemptedQuizzes - completedQuizzes, color: '#ddd6fe' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Dashboard Header Section */}
      <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="animate-fade-up">
              <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
                Dashboard
              </h1>
            </div>
            <div className="animate-fade-up animate-delay-200">
              <GradientButton asChild className="w-full sm:w-auto touch-target">
                <Link href="/dashboard/create">
                  <Plus className="mr-2 h-4 w-4" /> Create Quiz
                </Link>
              </GradientButton>
            </div>
          </div>
        </div>
      </Section>

      {/* Modern animated stats grid - Two rows layout */}
      <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="space-y-6">
            {/* First Row - 30% Quizzes Created / 70% Quizzes Completed */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Quizzes Created - 30% */}
              <div className="lg:col-span-3">
                <StaggerItem>
                  <div className="group relative h-full">
                    {/* Glass effect background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 group-hover:border-primary/30 transition-all duration-500"></div>
                    
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    
                    {/* Main card content */}
                    <div className="relative px-6 pt-8 pb-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
                      {/* Header with Icon and Title */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full border border-primary/20 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110">
                              <Brain className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-500" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-foreground">Quizzes Created</h3>
                            <p className="text-xs text-muted-foreground">Your creation activity</p>
                          </div>
                        </div>
                      </div>

                      {/* Main Counter */}
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          <AnimatedCounter value={stats?.quizzesCreated ?? 0} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Total Created</p>
                      </div>

                      {/* Additional Stats */}
                      <div className="space-y-3 flex-1">
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">This Week</span>
                            <span className="text-xs font-medium text-primary">+3</span>
                          </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Avg Quiz per Week</span>
                            <span className="text-xs font-medium text-primary">2.5</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating particles effect */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                  </div>
                </StaggerItem>
              </div>

              {/* Quizzes Completed - 70% (reorganized layout) */}
              <div className="lg:col-span-7">
                <StaggerItem>
                  <div className="group relative h-full">
                    {/* Glass effect background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 group-hover:border-primary/30 transition-all duration-500"></div>
                    
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    
                    {/* Main card content */}
                    <div className="relative px-4 pt-4 pb-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full">
                      {/* Header with Icon and Title - Top Center */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full border border-primary/20 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110">
                              <CheckCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-500" />
                            </div>
                          </div>
                          <div className="text-center">
                            <h3 className="text-base font-semibold text-foreground">Quizzes Completed</h3>
                            <p className="text-xs text-muted-foreground">Your completion overview</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats and Chart Section */}
                      <div className="flex items-start justify-center pt-2">
                        <div className="flex-1">
                          {/* Stats Section */}
                          <div className="space-y-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                <AnimatedCounter value={stats?.quizzesCompleted ?? 0} />
                              </div>
                              <p className="text-xl text-muted-foreground">Completed</p>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-primary">
                                {attemptedQuizzes}
                              </div>
                              <p className="text-xs text-muted-foreground">Attempted</p>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-primary">
                                {Math.round((completedQuizzes / attemptedQuizzes) * 100)}%
                              </div>
                              <p className="text-xs text-muted-foreground">Success Rate</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Chart Section */}
                        <div className="flex-1 flex items-start justify-center">
                          <div className="h-32 w-32">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={pieChartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={25}
                                  outerRadius={50}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex justify-center mt-1">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 shadow-lg shadow-purple-500/50 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">Completed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-200 shadow-lg shadow-purple-200/50 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">Attempted</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating particles effect */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                  </div>
                </StaggerItem>
              </div>
            </div>

            {/* Second Row - 70% Average Score / 30% Time Spent */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Average Score - 70% */}
              <div className="lg:col-span-7">
                <StaggerItem>
                  <div className="group relative h-full">
                    {/* Glass effect background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 group-hover:border-primary/30 transition-all duration-500"></div>
                    
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    
                    {/* Main card content */}
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full">
                      {/* Header with Icon and Title */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full border border-primary/20 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110">
                              <BarChart3 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-500" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-foreground">Average Score</h3>
                            <p className="text-xs text-muted-foreground">Your performance overview</p>
                          </div>
                        </div>
                      </div>

                      {/* Score Display */}
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          <AnimatedCounter value={stats?.averageScore ?? 0} />
                          <span className="text-2xl">%</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Overall Performance</p>
                      </div>

                      {/* Progress Circles */}
                      <div className="flex justify-center space-x-4">
                        <div className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-2">
                            <div className="absolute inset-0 rounded-full bg-muted"></div>
                            <div 
                              className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                              style={{ 
                                clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)`,
                                transform: `rotate(${(stats?.averageScore ?? 0) * 3.6}deg)`
                              }}
                            ></div>
                            <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">{stats?.averageScore ?? 0}%</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Current</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-2">
                            <div className="absolute inset-0 rounded-full bg-muted"></div>
                            <div 
                              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                              style={{ 
                                clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)`,
                                transform: `rotate(72deg)`
                              }}
                            ></div>
                            <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">85%</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Target</p>
                        </div>
                      </div>
                      
                      {/* Floating particles effect */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                  </div>
                </StaggerItem>
              </div>

              {/* Time Spent - 30% */}
              <div className="lg:col-span-3">
                <StaggerItem>
                  <div className="group relative h-full">
                    {/* Glass effect background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 group-hover:border-primary/30 transition-all duration-500"></div>
                    
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    
                    {/* Main card content */}
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
                      {/* Header with Icon and Title */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full border border-primary/20 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110">
                              <Clock className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-500" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-foreground">Time Spent</h3>
                            <p className="text-xs text-muted-foreground">Learning duration</p>
                          </div>
                        </div>
                      </div>

                      {/* Time Display */}
                      <div className="text-center mb-4 flex-1">
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {stats?.timeSpent ?? "0h"}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Total Time</p>
                      </div>

                      {/* Additional Stats */}
                      <div className="space-y-2">
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">This Week</span>
                            <span className="text-xs font-medium text-primary">2.5h</span>
                          </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Avg/Day</span>
                            <span className="text-xs font-medium text-primary">0.5h</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating particles effect */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                  </div>
                </StaggerItem>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}