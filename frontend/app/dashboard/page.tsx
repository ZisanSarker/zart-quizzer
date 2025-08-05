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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts"
import { LottieAnimation } from "@/components/lottie-animation"

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

  // Chart data for Average Score performance over 1 week
  const scoreChartData = [
    { day: 'Mon', score: 72, target: 85, aboveTarget: false },
    { day: 'Tue', score: 78, target: 85, aboveTarget: false },
    { day: 'Wed', score: 85, target: 85, aboveTarget: true },
    { day: 'Thu', score: 88, target: 85, aboveTarget: true },
    { day: 'Fri', score: 82, target: 85, aboveTarget: false },
    { day: 'Sat', score: 90, target: 85, aboveTarget: true },
    { day: 'Sun', score: 87, target: 85, aboveTarget: true },
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
                    <div className="relative px-6 pt-8 pb-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
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
                            <span className="text-xs text-muted-foreground">This Month</span>
                            <span className="text-xs font-medium text-primary">+12</span>
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
                    <div className="relative px-6 pt-12 pb-12 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
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
                      <div className="flex items-start justify-center pt-2 flex-1">
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
                          <div className="h-48 w-48">
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
                    <div className="relative px-6 pt-8 pb-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
                      {/* Header with Icon and Title - Left Side */}
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
                        
                        {/* Performance Text - Right Side */}
                        <div className="text-right">
                          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            <AnimatedCounter value={stats?.averageScore ?? 0} />
                            <span className="text-2xl">%</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Overall Performance</p>
                          <h4 className="text-sm font-semibold text-foreground mt-2">Weekly Performance</h4>
                        </div>
                      </div>

                      {/* Performance Line Chart - Centered Below */}
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={scoreChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                              <XAxis 
                                dataKey="day" 
                                stroke="#6b7280" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis 
                                stroke="#6b7280" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                                ticks={[0, 20, 40, 60, 80, 100]}
                                tickFormatter={(value) => `${value}%`}
                                allowDataOverflow={false}
                                scale="linear"
                                type="number"
                                tickCount={6}
                                minTickGap={10}
                              />
                              {/* Grid lines for each range */}
                              <ReferenceLine y={20} stroke="#374151" strokeDasharray="3 3" strokeWidth={1} opacity={0.3} />
                              <ReferenceLine y={40} stroke="#374151" strokeDasharray="3 3" strokeWidth={1} opacity={0.3} />
                              <ReferenceLine y={60} stroke="#374151" strokeDasharray="3 3" strokeWidth={1} opacity={0.3} />
                              <ReferenceLine y={80} stroke="#374151" strokeDasharray="3 3" strokeWidth={1} opacity={0.3} />
                              <ReferenceLine 
                                y={85} 
                                stroke="#3b82f6" 
                                strokeDasharray="3 3" 
                                strokeWidth={2}
                                label={{ value: "Target", position: "insideTopRight", fontSize: 10, fill: "#3b82f6" }}
                              />
                              <Tooltip 
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                        <p className="text-sm font-medium text-foreground">{label}</p>
                                        <p className="text-sm text-muted-foreground">Score: {payload[0].value}%</p>
                                      </div>
                                    )
                                  }
                                  return null
                                }}
                              />
                              {/* Performance line with conditional colors */}
                              <Line 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                dot={(props) => {
                                  const { cx, cy, payload } = props;
                                  const color = payload.aboveTarget ? '#f59e0b' : '#10b981';
                                  return (
                                    <circle 
                                      cx={cx} 
                                      cy={cy} 
                                      r={4} 
                                      fill={color} 
                                      stroke={color} 
                                      strokeWidth={2}
                                    />
                                  );
                                }}
                                activeDot={(props) => {
                                  const { cx, cy, payload } = props;
                                  const color = payload.aboveTarget ? '#f59e0b' : '#10b981';
                                  return (
                                    <circle 
                                      cx={cx} 
                                      cy={cy} 
                                      r={6} 
                                      fill="#ffffff" 
                                      stroke={color} 
                                      strokeWidth={2}
                                    />
                                  );
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        
                        {/* Legend */}
                        <div className="flex justify-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">Below Target</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">Above Target</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">Target (85%)</span>
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

              {/* Time Spent - 30% */}
              <div className="lg:col-span-3">
                <StaggerItem>
                  <div className="group relative h-full">
                    {/* Glass effect background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 group-hover:border-primary/30 transition-all duration-500"></div>
                    
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    
                    {/* Main card content */}
                    <div className="relative px-6 pt-8 pb-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
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

      {/* Motivation Section */}
      <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Lottie Animation */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-80 h-80 bg-muted/20 rounded-lg border border-border/50 flex items-center justify-center">
                <LottieAnimation 
                  animationPath="/business-ideas.json"
                  loop={true}
                  autoplay={true}
                />
              </div>
            </div>

            {/* Right Side - Motivation Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="animate-fade-up">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                  Keep Learning, Keep Growing
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Every quiz you create and complete brings you one step closer to mastering new skills. 
                  Your dedication to learning is what sets you apart.
                </p>
              </div>

              <div className="animate-fade-up animate-delay-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {stats?.quizzesCreated ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quizzes Created
                    </div>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {stats?.quizzesCompleted ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quizzes Completed
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-fade-up animate-delay-400">
                <GradientButton asChild className="w-full sm:w-auto">
                  <Link href="/dashboard/create">
                    <Plus className="mr-2 h-4 w-4" /> Create Your Next Quiz
                  </Link>
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Recent Quizzes Section */}
      <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="space-y-6">
            {/* Section Header */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Your Recent Quizzes
              </h2>
              <p className="text-lg text-muted-foreground">
                Track your latest quiz creations and their performance
              </p>
            </div>

            {/* Quizzes Grid */}
            {recentQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentQuizzes.slice(0, 3).map((quiz, index) => (
                  <StaggerItem key={quiz._id}>
                    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
                      {/* Glass effect background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-lg border border-white/20 group-hover:border-primary/30 transition-all duration-500"></div>
                      
                      {/* Animated border gradient */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                      
                      {/* Card Content */}
                      <div className="relative p-6 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500">
                        {/* Quiz Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                              {quiz.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {quiz.category || "General"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">Active</span>
                          </div>
                        </div>

                        {/* Quiz Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-xl font-bold text-primary">
                              {quiz.questions?.length || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Questions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-primary">
                              {quiz.attempts || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Attempts</div>
                          </div>
                        </div>

                        {/* Quiz Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-muted-foreground">
                              Created {new Date(quiz.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="group-hover:border-primary/50 group-hover:text-primary transition-colors duration-300"
                            >
                              <Link href={`/dashboard/quiz/preview/${quiz._id}`}>
                                <ArrowRight className="h-3 w-3 mr-1" />
                                Preview
                              </Link>
                            </Button>
                          </div>
                        </div>

                        {/* Floating particles effect */}
                        <div className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>
                    </Card>
                  </StaggerItem>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                  <Brain className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Quizzes Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start creating your first quiz to see it here
                </p>
                <GradientButton asChild>
                  <Link href="/dashboard/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Quiz
                  </Link>
                </GradientButton>
              </div>
            )}

            {/* View All Button */}
            {recentQuizzes.length > 0 && (
              <div className="text-center pt-6">
                <GradientButton asChild variant="outline">
                  <Link href="/dashboard/library">
                    <Trophy className="mr-2 h-4 w-4" />
                    View All Quizzes
                  </Link>
                </GradientButton>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Recommended Quizzes Section */}
      <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="space-y-6">
            {/* Section Header */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Recommended for You
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover quizzes tailored to your interests and learning goals
              </p>
            </div>

            {/* Quizzes Grid */}
            {recommendedQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedQuizzes.slice(0, 3).map((quiz, index) => (
                  <StaggerItem key={quiz._id}>
                    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
                      {/* Glass effect background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-lg border border-white/20 group-hover:border-primary/30 transition-all duration-500"></div>
                      
                      {/* Animated border gradient */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                      
                      {/* Card Content */}
                      <div className="relative p-6 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500">
                        {/* Quiz Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                              {quiz.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {quiz.category || "General"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">Recommended</span>
                          </div>
                        </div>

                        {/* Quiz Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-xl font-bold text-primary">
                              {quiz.questions?.length || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Questions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-primary">
                              {quiz.attempts || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Attempts</div>
                          </div>
                        </div>

                        {/* Quiz Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-muted-foreground">
                              Created {new Date(quiz.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="group-hover:border-primary/50 group-hover:text-primary transition-colors duration-300"
                            >
                              <Link href={`/dashboard/quiz/preview/${quiz._id}`}>
                                <ArrowRight className="h-3 w-3 mr-1" />
                                Preview
                              </Link>
                            </Button>
                          </div>
                        </div>

                        {/* Floating particles effect */}
                        <div className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>
                    </Card>
                  </StaggerItem>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Recommendations Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Complete more quizzes to get personalized recommendations
                </p>
                <GradientButton asChild>
                  <Link href="/explore">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Explore Quizzes
                  </Link>
                </GradientButton>
              </div>
            )}

            {/* View All Button */}
            {recommendedQuizzes.length > 0 && (
              <div className="text-center pt-6">
                <GradientButton asChild variant="outline">
                  <Link href="/explore">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    View All Recommendations
                  </Link>
                </GradientButton>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}