"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain, Clock, Star, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { FadeIn } from "@/components/animations/motion"
import { GradientButton } from "@/components/ui/gradient-button"
import { Section } from "@/components/section"

import type { ExploreQuiz } from "@/types/quiz"
import { getExploreQuizzes, saveQuiz } from "@/lib/quiz"

const PAGE_SIZE = 10

export default function ExplorePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [publicQuizzes, setPublicQuizzes] = useState<ExploreQuiz[]>([])
  const [savingQuizId, setSavingQuizId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setIsLoading(true)
    console.log('🔍 Fetching explore quizzes...')
    
    const params = {
      sort: activeTab as 'popular' | 'recent' | 'trending'
    }
    
    getExploreQuizzes(params)
      .then((data) => {
        console.log('📊 Explore quizzes fetched:', data.length)
        setPublicQuizzes(data)
      })
      .catch((error) => {
        console.error('❌ Failed to fetch explore quizzes:', error)
      })
      .finally(() => setIsLoading(false))
  }, [activeTab])

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  // Use the quizzes directly since filtering is now done server-side
  const sortedQuizzes = useMemo(() => {
    return publicQuizzes
  }, [publicQuizzes])

  // Pagination
  const totalPages = Math.ceil(sortedQuizzes.length / PAGE_SIZE)
  const pagedQuizzes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return sortedQuizzes.slice(start, end)
  }, [sortedQuizzes, currentPage])

  const handleSaveQuiz = async (quizId: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save quizzes." })
      return
    }
    setSavingQuizId(quizId)
    try {
      await saveQuiz(quizId)
      toast({
        title: "Quiz saved",
        description: "The quiz has been added to your library",
      })
    } catch (e: any) {
      toast({
        title: "Save failed",
        description: e?.response?.data?.message || "Could not save the quiz.",
      })
    } finally {
      setSavingQuizId(null)
    }
  }

  // Format date to relative time
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

  // Enhanced responsive pagination controls
  const Pagination = () => (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="touch-target"
      >
        Prev
      </Button>
      <span className="responsive-text-small text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="touch-target"
      >
        Next
      </Button>
    </div>
  )

  return (
    <div className="w-full flex flex-col items-center">
      {/* Explore Header Section */}
      <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="animate-fade-up">
              <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
                Explore Quizzes
              </h1>
              <p className="responsive-text text-muted-foreground mt-1">Discover and practice quizzes created by the community</p>
            </div>
            <div className="animate-fade-up animate-delay-200">
              <GradientButton asChild className="w-full sm:w-auto touch-target">
                <Link href="/dashboard/create">Create Your Own Quiz</Link>
              </GradientButton>
            </div>
          </div>
        </div>
      </Section>

      {/* Explore Content Section */}
      <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-24 sm:gap-32 lg:gap-40 xl:gap-48 px-4 sm:px-6 lg:px-8 xl:px-10">
                <TabsList className="w-full sm:w-auto glass-effect-tabs">
                  <TabsTrigger 
                    value="popular" 
                    className="touch-target glass-tab-trigger"
                  >
                    Popular
                  </TabsTrigger>
                  <TabsTrigger 
                    value="recent" 
                    className="touch-target glass-tab-trigger"
                  >
                    Recent
                  </TabsTrigger>
                  <TabsTrigger 
                    value="trending" 
                    className="touch-target glass-tab-trigger"
                  >
                    Trending
                  </TabsTrigger>
                </TabsList>
                <div className="responsive-text-small text-muted-foreground">{sortedQuizzes.length} quizzes found</div>
              </div>
            </div>

                {/* Popular Tab */}
                <TabsContent value="popular" className="space-y-4 sm:space-y-6">
                  {isLoading ? (
                    <SkeletonList />
                  ) : pagedQuizzes.length > 0 ? (
                    <>
                      {pagedQuizzes.map((quiz) => (
                        <QuizCard
                          key={quiz._id}
                          quiz={quiz}
                          onSave={handleSaveQuiz}
                          saving={savingQuizId === quiz._id}
                          formatRelativeTime={formatRelativeTime}
                        />
                      ))}
                      <Pagination />
                    </>
                  ) : (
                    <NoQuizzesNotice onClearFilters={() => {
                      setSearchQuery("")
                      setDebouncedSearchQuery("")
                      setSelectedCategory("All Categories")
                      setSelectedDifficulty("All Levels")
                    }} />
                  )}
                </TabsContent>

                {/* Recent Tab */}
                <TabsContent value="recent" className="space-y-4 sm:space-y-6">
                  {isLoading ? (
                    <SkeletonList />
                  ) : pagedQuizzes.length > 0 ? (
                    <>
                      {pagedQuizzes.map((quiz) => (
                        <QuizCard
                          key={quiz._id}
                          quiz={quiz}
                          onSave={handleSaveQuiz}
                          saving={savingQuizId === quiz._id}
                          formatRelativeTime={formatRelativeTime}
                        />
                      ))}
                      <Pagination />
                    </>
                  ) : (
                    <NoQuizzesNotice onClearFilters={() => {
                      setSearchQuery("")
                      setDebouncedSearchQuery("")
                      setSelectedCategory("All Categories")
                      setSelectedDifficulty("All Levels")
                    }} />
                  )}
                </TabsContent>

                                 {/* Trending Tab */}
                 <TabsContent value="trending" className="space-y-4 sm:space-y-6">
                   {isLoading ? (
                     <SkeletonList />
                   ) : pagedQuizzes.length > 0 ? (
                     <>
                       {pagedQuizzes.map((quiz) => (
                         <QuizCard
                           key={quiz._id}
                           quiz={quiz}
                           onSave={handleSaveQuiz}
                           saving={savingQuizId === quiz._id}
                           formatRelativeTime={formatRelativeTime}
                         />
                       ))}
                       <Pagination />
                     </>
                   ) : (
                     <NoQuizzesNotice />
                   )}
                 </TabsContent>
               </Tabs>
        </div>
      </Section>
    </div>
  )
}

function QuizCard({
  quiz,
  onSave,
  saving,
  formatRelativeTime,
}: {
  quiz: ExploreQuiz
  onSave: (id: string) => void
  saving: boolean
  formatRelativeTime: (date: string) => string
}) {
  const difficultyMap: Record<string, string> = {
    easy: "Beginner",
    medium: "Intermediate",
    hard: "Advanced",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }
  const uiDifficulty = difficultyMap[(quiz.difficulty || "").toLowerCase()] || quiz.difficulty

  return (
    <Card className="card-hover mobile-card">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Link href={`/dashboard/quiz/practice/${quiz._id}`} className="hover:text-primary transition-colors">
                  <h3 className="responsive-heading-3 hover:underline truncate">{quiz.topic}</h3>
                </Link>
                <p className="responsive-text-small text-muted-foreground mt-1 line-clamp-2">{quiz.description}</p>
              </div>
              <Badge
                variant={
                  uiDifficulty === "Beginner"
                    ? "outline"
                    : uiDifficulty === "Intermediate"
                      ? "secondary"
                      : "default"
                }
                className="flex-shrink-0"
              >
                {uiDifficulty}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {(quiz.tags || []).map((tag) => (
                <Badge key={tag} variant="outline" className="bg-muted/50 responsive-text-small">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-4">
              <div 
                className="metric-badge metric-badge-blue flex items-center gap-1 px-3 py-1.5 rounded-full group relative" 
                title={`${quiz.questions.length} question${quiz.questions.length === 1 ? '' : 's'} in this quiz`}
              >
                <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}
                </span>
              </div>
              
              <div 
                className="metric-badge metric-badge-green flex items-center gap-1 px-3 py-1.5 rounded-full group relative" 
                title={`${quiz.attempts ?? 0} user${quiz.attempts === 1 ? '' : 's'} have attempted this quiz`}
              >
                <Users className="h-4 w-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">{quiz.attempts ?? 0} attempts</span>
              </div>
              
              <div 
                className="metric-badge metric-badge-purple flex items-center gap-1 px-3 py-1.5 rounded-full group relative" 
                title={`Created ${formatRelativeTime(quiz.createdAt)}`}
              >
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{formatRelativeTime(quiz.createdAt)}</span>
              </div>
              
              <div 
                className="metric-badge metric-badge-amber flex items-center gap-1 px-3 py-1.5 rounded-full group relative" 
                title={`Average rating: ${quiz.rating ? quiz.rating.toFixed(1) : "0.0"}/5.0`}
              >
                <Star className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">{quiz.rating ? quiz.rating.toFixed(1) : "0.0"}</span>
              </div>
              
              <div 
                className="metric-badge metric-badge-orange flex items-center gap-1 px-3 py-1.5 rounded-full group relative" 
                title={`${quiz.ratingCount ?? 0} user${quiz.ratingCount === 1 ? '' : 's'} rated this quiz`}
              >
                <div className="w-4 h-4 rounded-full bg-orange-600 dark:bg-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xs font-bold text-white">{quiz.ratingCount ?? 0}</span>
                </div>
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">{quiz.ratingCount === 1 ? "rating" : "ratings"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end gap-4 lg:min-w-0">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="text-sm text-right min-w-0 flex-1 lg:flex-none">
                <Link 
                  href={`/dashboard/profile/${quiz.author?._id || 'unknown'}`}
                  className="group hover:text-primary transition-colors duration-200 author-link"
                >
                  <p className="font-medium responsive-text-small truncate group-hover:underline">
                    {quiz.author?.name || "Unknown Author"}
                  </p>
                  <p className="responsive-text-small text-muted-foreground group-hover:text-primary/70 transition-colors duration-200">
                    Author
                  </p>
                </Link>
              </div>
              <Link 
                href={`/dashboard/profile/${quiz.author?._id || 'unknown'}`}
                className="flex-shrink-0 group"
              >
                <Avatar className="group-hover:scale-105 transition-transform duration-200 group-hover:ring-2 group-hover:ring-primary/20 author-avatar-hover">
                  <AvatarImage src={quiz.author?.avatar || "/placeholder.svg"} alt={quiz.author?.name} />
                  <AvatarFallback>{quiz.author?.initials || "?"}</AvatarFallback>
                </Avatar>
              </Link>
            </div>

            <div className="flex gap-2 w-full lg:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSave(quiz._id)}
                disabled={saving}
                className="flex-1 lg:flex-none touch-target"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button asChild className="flex-1 lg:flex-none touch-target">
                <Link href={`/dashboard/quiz/practice/${quiz._id}`}>Practice</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced responsive skeleton loader
function SkeletonList() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse mobile-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-muted rounded"></div>
                  <div className="h-6 w-16 bg-muted rounded"></div>
                </div>
                <div className="flex gap-4">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-4 w-24 bg-muted rounded"></div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                </div>
                <div className="h-10 w-28 bg-muted rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Enhanced responsive no quizzes notice
function NoQuizzesNotice() {
  return (
    <FadeIn>
      <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed mobile-card">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="responsive-heading-3 mb-2">No quizzes found</h3>
        <p className="responsive-text text-muted-foreground mb-6">No quizzes available in this category</p>
      </div>
    </FadeIn>
  )
}