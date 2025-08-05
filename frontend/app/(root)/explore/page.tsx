"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain, Clock, Search, Star, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { FadeIn } from "@/components/animations/motion"

import type { ExploreQuiz } from "@/types/quiz"
import { getExploreQuizzes, saveQuiz } from "@/lib/quiz"

const difficultyMap: Record<string, string> = {
  easy: "Beginner",
  medium: "Intermediate",
  hard: "Advanced",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}
const uiToBackendDifficulty: Record<string, string> = {
  "Beginner": "easy",
  "Intermediate": "medium",
  "Advanced": "hard",
  "All Levels": "",
}

const categories = [
  "All Categories",
  "Mathematics",
  "Science",
  "History",
  "Literature",
  "Computer Science",
  "Geography",
  "Languages",
  "Arts",
]

const difficulties = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced"
]

const PAGE_SIZE = 10

export default function ExplorePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels")
  const [isLoading, setIsLoading] = useState(true)
  const [publicQuizzes, setPublicQuizzes] = useState<ExploreQuiz[]>([])
  const [savingQuizId, setSavingQuizId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setIsLoading(true)
    console.log('🔍 Fetching explore quizzes...')
    getExploreQuizzes()
      .then((data) => {
        console.log('📊 Explore quizzes fetched:', data.length)
        setPublicQuizzes(data)
      })
      .catch((error) => {
        console.error('❌ Failed to fetch explore quizzes:', error)
      })
      .finally(() => setIsLoading(false))
  }, [])

  // Reset page when filter/search/tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedDifficulty, activeTab])

  // Filtering logic
  const filteredQuizzes = useMemo(() => {
    return publicQuizzes.filter((quiz) => {
      const lowerQuery = searchQuery.trim().toLowerCase()
      const matchesSearch =
        quiz.topic.toLowerCase().includes(lowerQuery) ||
        (quiz.description?.toLowerCase().includes(lowerQuery) ?? false) ||
        (quiz.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ?? false)

      const matchesCategory =
        selectedCategory === "All Categories" ||
        quiz.topic === selectedCategory ||
        (quiz.tags?.map(t => t.toLowerCase()).includes(selectedCategory.toLowerCase()) ?? false)

      const backendDifficulty = (quiz.difficulty || "").toLowerCase()
      const uiDifficulty = difficultyMap[backendDifficulty] || backendDifficulty
      const matchesDifficulty =
        selectedDifficulty === "All Levels" ||
        uiDifficulty === selectedDifficulty

      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }, [publicQuizzes, searchQuery, selectedCategory, selectedDifficulty])

  // Sorting logic for each tab
  const sortedQuizzes = useMemo(() => {
    if (activeTab === "popular") {
      return filteredQuizzes
        .slice()
        .sort((a, b) =>
          (b.rating ?? 0) - (a.rating ?? 0) !== 0
            ? (b.rating ?? 0) - (a.rating ?? 0)
            : (b.attempts ?? 0) - (a.attempts ?? 0)
        )
    }
    if (activeTab === "recent") {
      return filteredQuizzes
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    if (activeTab === "trending") {
      return filteredQuizzes
        .slice()
        .sort((a, b) => {
          // Primary sort: highest attempt count
          const attemptsDiff = (b.attempts ?? 0) - (a.attempts ?? 0)
          if (attemptsDiff !== 0) return attemptsDiff
          // Secondary sort: highest rating
          return (b.rating ?? 0) - (a.rating ?? 0)
        })
    }
    return filteredQuizzes.slice()
  }, [filteredQuizzes, activeTab])

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
    <main className="flex-1 mx-auto py-6 sm:py-8 max-w-6xl">
      {/* Enhanced responsive header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="responsive-heading-1 gradient-heading">Explore Quizzes</h1>
          <p className="responsive-text text-muted-foreground mt-1">Discover and practice quizzes created by the community</p>
        </div>
        <Link href="/dashboard/create" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto touch-target">Create Your Own Quiz</Button>
        </Link>
      </div>

      {/* Enhanced responsive layout */}
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        {/* Enhanced responsive sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="font-medium mb-2 responsive-text-small">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                className="pl-10 responsive-text-small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 responsive-text-small">Category</h3>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="font-medium mb-2 responsive-text-small">Difficulty</h3>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="font-medium mb-2 responsive-text-small">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {["mathematics", "science", "history", "programming", "literature", "geography"].map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 touch-target responsive-text-small"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced responsive main content */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="popular" className="touch-target">Popular</TabsTrigger>
                <TabsTrigger value="recent" className="touch-target">Recent</TabsTrigger>
                <TabsTrigger value="trending" className="touch-target">Trending</TabsTrigger>
              </TabsList>
              <div className="responsive-text-small text-muted-foreground">{filteredQuizzes.length} quizzes found</div>
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
                <NoQuizzesNotice onClearFilters={() => {
                  setSearchQuery("")
                  setSelectedCategory("All Categories")
                  setSelectedDifficulty("All Levels")
                }} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
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
    <Card className="card-hover mobile-card animate-fade-in" style={{
      animationDelay: `${Math.random() * 500}ms`,
      animation: 'fadeInUp 0.8s ease-out forwards'
    }}>
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

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-4" style={{
              animation: 'fadeInUp 0.8s ease-out forwards',
              animationDelay: '200ms'
            }}>
              <div 
                className="metric-badge metric-badge-blue flex items-center gap-1 px-3 py-1.5 rounded-full group relative" 
                style={{
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: '300ms'
                }}
                title={`${quiz.questions.length} question${quiz.questions.length === 1 ? '' : 's'} in this quiz`}
              >
                <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}
                </span>
              </div>
              
              <div 
                className="metric-badge metric-badge-green flex items-center gap-1 px-3 py-1.5 rounded-full group relative" 
                style={{
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: '400ms'
                }}
                title={`${quiz.attempts ?? 0} user${quiz.attempts === 1 ? '' : 's'} have attempted this quiz`}
              >
                <Users className="h-4 w-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">{quiz.attempts ?? 0} attempts</span>
              </div>
              
              <div 
                className="metric-badge metric-badge-purple flex items-center gap-1 px-3 py-1.5 rounded-full group relative" 
                style={{
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: '500ms'
                }}
                title={`Created ${formatRelativeTime(quiz.createdAt)}`}
              >
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{formatRelativeTime(quiz.createdAt)}</span>
              </div>
              
              <div 
                className="metric-badge metric-badge-amber flex items-center gap-1 px-3 py-1.5 rounded-full group relative" 
                style={{
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: '600ms'
                }}
                title={`Average rating: ${quiz.rating ? quiz.rating.toFixed(1) : "0.0"}/5.0`}
              >
                <Star className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">{quiz.rating ? quiz.rating.toFixed(1) : "0.0"}</span>
              </div>
              
              <div 
                className="metric-badge metric-badge-orange flex items-center gap-1 px-3 py-1.5 rounded-full group relative" 
                style={{
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: '700ms'
                }}
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
                <p className="font-medium responsive-text-small truncate">{quiz.author?.name}</p>
                <p className="responsive-text-small text-muted-foreground">Author</p>
              </div>
              <Avatar className="flex-shrink-0">
                <AvatarImage src={quiz.author?.avatar || "/placeholder.svg"} alt={quiz.author?.name} />
                <AvatarFallback>{quiz.author?.initials || "?"}</AvatarFallback>
              </Avatar>
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
function NoQuizzesNotice({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <FadeIn>
      <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed mobile-card">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="responsive-heading-3 mb-2">No quizzes found</h3>
        <p className="responsive-text text-muted-foreground mb-6">Try adjusting your filters or search query</p>
        <Button onClick={onClearFilters} className="touch-target">Clear Filters</Button>
      </div>
    </FadeIn>
  )
}