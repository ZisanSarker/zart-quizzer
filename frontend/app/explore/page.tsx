"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
import { useAuth } from "@/contexts/auth-context"

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

export default function ExplorePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels")
  const [isLoading, setIsLoading] = useState(true)
  const [publicQuizzes, setPublicQuizzes] = useState<ExploreQuiz[]>([])
  const [savingQuizId, setSavingQuizId] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    getExploreQuizzes()
      .then(setPublicQuizzes)
      .finally(() => setIsLoading(false))
  }, [])

  // Filter quizzes based on search query, category, and difficulty
  const filteredQuizzes = publicQuizzes.filter((quiz) => {
    const matchesSearch =
      quiz.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quiz.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (quiz.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ?? false)

    const matchesCategory =
      selectedCategory === "All Categories" ||
      quiz.topic === selectedCategory ||
      quiz.tags?.map(t => t.toLowerCase()).includes(selectedCategory.toLowerCase())

    const matchesDifficulty =
      selectedDifficulty === "All Levels" ||
      quiz.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()

    return matchesSearch && matchesCategory && matchesDifficulty
  })

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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Brain className="h-6 w-6 text-primary" />
            <span className="gradient-heading">ZART Quizzer</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/explore" className="text-sm font-medium text-primary">
              Explore
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-heading">Explore Quizzes</h1>
            <p className="text-muted-foreground mt-1">Discover and practice quizzes created by the community</p>
          </div>
          <Link href="/dashboard/create">
            <Button>Create Your Own Quiz</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Category</h3>
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
              <h3 className="font-medium mb-2">Difficulty</h3>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Levels">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["mathematics", "science", "history", "programming", "literature", "geography"].map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Tabs defaultValue="popular">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                </TabsList>
                <div className="text-sm text-muted-foreground">{filteredQuizzes.length} quizzes found</div>
              </div>

              <TabsContent value="popular" className="space-y-6">
                {isLoading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
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
                ) : filteredQuizzes.length > 0 ? (
                  filteredQuizzes
                    .sort((a, b) => (b.attempts ?? 0) - (a.attempts ?? 0))
                    .map((quiz) => (
                      <QuizCard
                        key={quiz._id}
                        quiz={quiz}
                        onSave={handleSaveQuiz}
                        saving={savingQuizId === quiz._id}
                        formatRelativeTime={formatRelativeTime}
                      />
                    ))
                ) : (
                  <FadeIn>
                    <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
                      <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
                      <Button
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("All Categories")
                          setSelectedDifficulty("All Levels")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </FadeIn>
                )}
              </TabsContent>

              <TabsContent value="recent" className="space-y-6">
                {isLoading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
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
                ) : filteredQuizzes.length > 0 ? (
                  filteredQuizzes
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((quiz) => (
                      <QuizCard
                        key={quiz._id}
                        quiz={quiz}
                        onSave={handleSaveQuiz}
                        saving={savingQuizId === quiz._id}
                        formatRelativeTime={formatRelativeTime}
                      />
                    ))
                ) : (
                  <FadeIn>
                    <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
                      <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
                      <Button
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("All Categories")
                          setSelectedDifficulty("All Levels")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </FadeIn>
                )}
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                {isLoading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
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
                ) : filteredQuizzes.length > 0 ? (
                  filteredQuizzes
                    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                    .map((quiz) => (
                      <QuizCard
                        key={quiz._id}
                        quiz={quiz}
                        onSave={handleSaveQuiz}
                        saving={savingQuizId === quiz._id}
                        formatRelativeTime={formatRelativeTime}
                      />
                    ))
                ) : (
                  <FadeIn>
                    <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
                      <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
                      <Button
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("All Categories")
                          setSelectedDifficulty("All Levels")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </FadeIn>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 bg-muted/30">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-semibold gradient-heading">ZART Quizzer</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 ZART Quizzer. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
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
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/dashboard/quiz/practice/${quiz._id}`} className="hover:text-primary transition-colors">
                  <h3 className="text-xl font-bold hover:underline">{quiz.topic}</h3>
                </Link>
                <p className="text-muted-foreground mt-1">{quiz.description}</p>
              </div>
              <Badge
                variant={
                  quiz.difficulty === "easy"
                    ? "outline"
                    : quiz.difficulty === "medium"
                      ? "secondary"
                      : "default"
                }
              >
                {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {(quiz.tags || []).map((tag) => (
                <Badge key={tag} variant="outline" className="bg-muted/50">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{quiz.questions.length} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{quiz.attempts ?? 0} attempts</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="text-sm">{quiz.rating ?? 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatRelativeTime(quiz.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end gap-4">
            <div className="flex items-center gap-2">
              <div className="text-sm text-right">
                <p className="font-medium">{quiz.author?.name}</p>
                <p className="text-muted-foreground">Author</p>
              </div>
              <Avatar>
                <AvatarImage src={quiz.author?.avatar || "/placeholder.svg"} alt={quiz.author?.name} />
                <AvatarFallback>{quiz.author?.initials || "?"}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSave(quiz._id)}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button asChild>
                <Link href={`/dashboard/quiz/practice/${quiz._id}`}>Practice</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}