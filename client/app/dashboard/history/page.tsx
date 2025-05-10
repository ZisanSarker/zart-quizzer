"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import { Brain, Calendar, Clock, Search, Trophy } from "lucide-react"
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations/motion"
import { getRecentQuizAttempts } from "@/lib/quiz"
import type { RecentQuizAttempt } from "@/types/quiz"


// Mock data for performance by topic
const performanceByTopicMock = [
  { topic: "Mathematics", attempts: 12, averageScore: 88 },
  { topic: "Science", attempts: 8, averageScore: 75 },
  { topic: "History", attempts: 6, averageScore: 82 },
  { topic: "Geography", attempts: 4, averageScore: 78 },
  { topic: "Literature", attempts: 3, averageScore: 70 },
]

// Mock data for recent achievements
const achievementsMock = [
  { id: "a1", title: "Perfect Score", description: "Achieved 100% on a quiz", date: "2023-06-12T14:30:00Z" },
  { id: "a2", title: "Quiz Master", description: "Completed 10 quizzes", date: "2023-06-05T09:15:00Z" },
  { id: "a3", title: "Fast Learner", description: "Improved score by 20% on a retake", date: "2023-05-28T16:45:00Z" },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [quizHistory, setQuizHistory] = useState<RecentQuizAttempt[]>([])
  const [performanceByTopic, setPerformanceByTopic] = useState(performanceByTopicMock)
  const [achievements, setAchievements] = useState(achievementsMock)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecentQuizAttempts()
        setQuizHistory(data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchData()
  }, [])
  

  // Filter quiz history based on search query
  const filteredHistory = quizHistory.filter((item) => item.quizTitle.toLowerCase().includes(searchQuery.toLowerCase()))

  // Get score badge color based on score
  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500 hover:bg-green-600"
    if (score >= 70) return "bg-primary hover:bg-primary/90"
    if (score >= 50) return "bg-yellow-500 hover:bg-yellow-600"
    return "bg-red-500 hover:bg-red-600"
  }

  // Format date to relative time (e.g., "2 days ago")
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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">Quiz History</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search quiz history..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 mb-6">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Quizzes Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{quizHistory.length}</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(quizHistory.reduce((acc, item) => acc + item.score, 0) / quizHistory.length)}%
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Topics Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{performanceByTopic.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="grid w-full max-w-full sm:max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="history">Quiz History</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-6 bg-muted rounded w-48"></div>
                        <div className="h-4 bg-muted rounded w-32"></div>
                      </div>
                      <div className="h-10 w-10 bg-muted rounded-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredHistory.length > 0 ? (
            <StaggerChildren className="space-y-4">
              {filteredHistory.map((item) => (
                <StaggerItem key={item.id}>
                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                        <div>
                          <h3 className="font-medium text-lg">{item.quizTitle}</h3>
                          <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatRelativeTime(item.completedAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Brain className="h-4 w-4" />
                              <span>{item.totalQuestions} questions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{item.timeTaken}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex items-center justify-center w-16 h-16 rounded-full ${getScoreBadgeColor(item.score)} text-white`}
                            >
                              <span className="text-xl font-bold">{item.score}%</span>
                            </div>
                            <span className="text-xs mt-1 text-muted-foreground">Score</span>
                          </div>
                          <Button asChild>
                            <Link href={`/dashboard/quiz/practice/${item.quizId}`}>Retake Quiz</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : (
            <FadeIn>
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No quiz history found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? "No quizzes match your search query" : "You haven't taken any quizzes yet"}
                </p>
                <Button asChild>
                  <Link href="/explore">
                    <Search className="mr-2 h-4 w-4" /> Find Quizzes to Practice
                  </Link>
                </Button>
              </div>
            </FadeIn>
          )}
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Topic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceByTopic.map((item) => (
                    <div key={item.topic} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{item.topic}</div>
                        <div className="text-sm text-muted-foreground">{item.attempts} attempts</div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${item.averageScore}%` }}></div>
                      </div>
                      <div className="text-sm text-right">{item.averageScore}% average</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quizHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${getScoreBadgeColor(item.score)} text-white flex-shrink-0`}
                      >
                        <span className="text-sm font-bold">{item.score}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.quizTitle}</div>
                        <div className="text-sm text-muted-foreground">{formatRelativeTime(item.completedAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                  <p className="text-muted-foreground mb-4">{achievement.description}</p>
                  <Badge variant="outline" className="mt-auto">
                    {formatRelativeTime(achievement.date)}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
