"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"
import { Brain, Clock, Edit, MoreHorizontal, Plus, Search, Share2, Trash2, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations/motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock data for created quizzes
const createdQuizzesMock = [
  {
    _id: "1",
    topic: "Mathematics - Algebra Basics",
    description: "Fundamental concepts of algebra",
    questions: [
      {
        _id: "q1",
        questionText: "What is the value of x in the equation 2x + 5 = 15?",
        options: ["5", "10", "7.5", "5.5"],
        correctAnswer: "5",
        explanation: "2x + 5 = 15 => 2x = 10 => x = 5",
      },
      {
        _id: "q2",
        questionText: "Which of the following is a quadratic equation?",
        options: ["y = 2x + 3", "y = x²", "y = 3/x", "y = √x"],
        correctAnswer: "y = x²",
        explanation: "A quadratic equation contains x²",
      },
    ],
    difficulty: "medium",
    createdAt: "2023-05-15T10:30:00Z",
    createdBy: "user123",
    isPublic: true,
    attempts: 28,
  },
  {
    _id: "2",
    topic: "Science - Quantum Physics",
    description: "Introduction to quantum mechanics",
    questions: [
      {
        _id: "q3",
        questionText: "What is Heisenberg's Uncertainty Principle about?",
        options: [
          "The speed of light",
          "The position and momentum of a particle",
          "The mass of an electron",
          "The structure of DNA",
        ],
        correctAnswer: "The position and momentum of a particle",
        explanation:
          "Heisenberg's Uncertainty Principle states that we cannot simultaneously know the exact position and momentum of a particle.",
      },
    ],
    difficulty: "hard",
    createdAt: "2023-04-10T14:20:00Z",
    createdBy: "user123",
    isPublic: true,
    attempts: 42,
  },
  {
    _id: "3",
    topic: "History - World War II",
    description: "Major events and figures of WWII",
    questions: [
      {
        _id: "q4",
        questionText: "When did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correctAnswer: "1945",
        explanation: "World War II ended in 1945 with the surrender of Japan after the atomic bombings.",
      },
    ],
    difficulty: "medium",
    createdAt: "2023-03-05T09:15:00Z",
    createdBy: "user123",
    isPublic: true,
    attempts: 56,
  },
  {
    _id: "4",
    topic: "Computer Science - Data Structures",
    description: "Common data structures and algorithms",
    questions: [
      {
        _id: "q5",
        questionText: "Which data structure operates on a LIFO principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctAnswer: "Stack",
        explanation: "A stack operates on Last In, First Out (LIFO) principle.",
      },
    ],
    difficulty: "easy",
    createdAt: "2023-06-20T16:45:00Z",
    createdBy: "user123",
    isPublic: false,
    attempts: 5,
  },
]

// Mock data for saved quizzes
const savedQuizzesMock = [
  {
    _id: "5",
    topic: "Geography - European Countries",
    description: "Test your knowledge of European geography",
    questions: [
      {
        _id: "q6",
        questionText: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris",
        explanation: "Paris is the capital city of France.",
      },
    ],
    difficulty: "medium",
    createdAt: "2023-05-05T11:30:00Z",
    createdBy: "jane_smith",
    author: "Jane Smith",
    isPublic: true,
    attempts: 120,
  },
  {
    _id: "6",
    topic: "Literature - Shakespeare's Works",
    description: "Test your knowledge of Shakespeare's famous plays",
    questions: [
      {
        _id: "q7",
        questionText: "Which play features the character Hamlet?",
        options: ["Macbeth", "Romeo and Juliet", "Hamlet", "Othello"],
        correctAnswer: "Hamlet",
        explanation: "The character Hamlet is the protagonist of Shakespeare's play 'Hamlet'.",
      },
    ],
    difficulty: "hard",
    createdAt: "2023-04-15T13:20:00Z",
    createdBy: "mike_johnson",
    author: "Mike Johnson",
    isPublic: true,
    attempts: 85,
  },
  {
    _id: "7",
    topic: "Biology - Human Anatomy",
    description: "Learn about the human body systems",
    questions: [
      {
        _id: "q8",
        questionText: "Which organ is responsible for filtering blood?",
        options: ["Heart", "Lungs", "Kidneys", "Liver"],
        correctAnswer: "Kidneys",
        explanation: "The kidneys filter waste products from the blood and produce urine.",
      },
    ],
    difficulty: "medium",
    createdAt: "2023-03-10T09:45:00Z",
    createdBy: "sarah_williams",
    author: "Sarah Williams",
    isPublic: true,
    attempts: 95,
  },
]

export default function LibraryPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [createdQuizzes, setCreatedQuizzes] = useState(createdQuizzesMock)
  const [savedQuizzes, setSavedQuizzes] = useState(savedQuizzesMock)
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDeleteQuiz = (quizId: string) => {
    // Remove the quiz from the state
    setCreatedQuizzes(createdQuizzes.filter((quiz) => quiz._id !== quizId))
    setQuizToDelete(null)

    toast({
      title: "Quiz deleted",
      description: "The quiz has been deleted successfully",
    })
  }

  const handleShareQuiz = (quizId: string) => {
    // Copy the quiz URL to clipboard
    const quizUrl = `${window.location.origin}/dashboard/quiz/preview/${quizId}`
    navigator.clipboard.writeText(quizUrl)

    toast({
      title: "Link copied",
      description: "Quiz link has been copied to clipboard",
    })
  }

  const handleToggleVisibility = (quizId: string, isCurrentlyPublic: boolean) => {
    // Update the quiz visibility in the state
    setCreatedQuizzes(
      createdQuizzes.map((quiz) => (quiz._id === quizId ? { ...quiz, isPublic: !isCurrentlyPublic } : quiz)),
    )

    toast({
      title: "Visibility updated",
      description: `Quiz is now ${!isCurrentlyPublic ? "public" : "private"}`,
    })
  }

  const handleRemoveSavedQuiz = (quizId: string) => {
    // Remove the quiz from saved quizzes
    setSavedQuizzes(savedQuizzes.filter((quiz) => quiz._id !== quizId))

    toast({
      title: "Quiz removed",
      description: "The quiz has been removed from your saved quizzes",
    })
  }

  // Filter quizzes based on search query
  const filteredCreatedQuizzes = createdQuizzes.filter((quiz) =>
    quiz.topic.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSavedQuizzes = savedQuizzes.filter((quiz) =>
    quiz.topic.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">My Library</h1>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="mr-2 h-4 w-4" /> Create Quiz
          </Link>
        </Button>
      </div>

      <div className="mb-6">
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

      <Tabs defaultValue="created">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="created">Created by Me</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="created">
          {isLoading ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="h-4 bg-muted rounded w-full mb-4"></div>
                    <div className="h-4 bg-muted rounded w-full mb-4"></div>
                    <div className="h-10 bg-muted rounded w-full mt-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCreatedQuizzes.length > 0 ? (
            <StaggerChildren className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCreatedQuizzes.map((quiz) => (
                <StaggerItem key={quiz._id}>
                  <Card className="card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <CardTitle className="text-lg">{quiz.topic}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/quiz/edit/${quiz._id}`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShareQuiz(quiz._id)}>
                              <Share2 className="mr-2 h-4 w-4" /> Share
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleVisibility(quiz._id, !!quiz.isPublic)}>
                              <Users className="mr-2 h-4 w-4" />
                              Make {quiz.isPublic ? "Private" : "Public"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setQuizToDelete(quiz._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>{quiz.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Brain className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.questions.length} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.attempts} attempts</span>
                        </div>
                        <div>
                          {quiz.isPublic ? (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Public</span>
                          ) : (
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">Private</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/dashboard/quiz/preview/${quiz._id}`}>Preview</Link>
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/dashboard/quiz/practice/${quiz._id}`}>Practice</Link>
                        </Button>
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
                <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? "No quizzes match your search query" : "You haven't created any quizzes yet"}
                </p>
                <Button asChild>
                  <Link href="/dashboard/create">
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Quiz
                  </Link>
                </Button>
              </div>
            </FadeIn>
          )}
        </TabsContent>

        <TabsContent value="saved">
          {isLoading ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="h-4 bg-muted rounded w-full mb-4"></div>
                    <div className="h-4 bg-muted rounded w-full mb-4"></div>
                    <div className="h-10 bg-muted rounded w-full mt-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredSavedQuizzes.length > 0 ? (
            <StaggerChildren className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSavedQuizzes.map((quiz) => (
                <StaggerItem key={quiz._id}>
                  <Card className="card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <CardTitle className="text-lg">{quiz.topic}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleShareQuiz(quiz._id)}>
                              <Share2 className="mr-2 h-4 w-4" /> Share
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleRemoveSavedQuiz(quiz._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>By {quiz.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Brain className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.questions.length} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Saved {new Date(quiz.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-xs bg-muted px-2 py-1 rounded-full capitalize">{quiz.difficulty}</span>
                      </div>
                      <div className="mt-4">
                        <Button className="w-full" asChild>
                          <Link href={`/dashboard/quiz/practice/${quiz._id}`}>Practice Quiz</Link>
                        </Button>
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
                <h3 className="text-lg font-medium mb-2">No saved quizzes</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? "No saved quizzes match your search query" : "You haven't saved any quizzes yet"}
                </p>
                <Button asChild>
                  <Link href="/explore">
                    <Search className="mr-2 h-4 w-4" /> Explore Quizzes
                  </Link>
                </Button>
              </div>
            </FadeIn>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!quizToDelete} onOpenChange={(open) => !open && setQuizToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => quizToDelete && handleDeleteQuiz(quizToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
