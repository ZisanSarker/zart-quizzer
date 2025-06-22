"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  getUserQuizzes,
  getSavedQuizzes,
  deleteQuiz,
  updateQuizVisibility,
  unsaveQuiz,
} from "@/lib/quiz"

export default function LibraryPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [createdQuizzes, setCreatedQuizzes] = useState<any[]>([])
  const [savedQuizzes, setSavedQuizzes] = useState<any[]>([])
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null)
  const [unsavingQuizId, setUnsavingQuizId] = useState<string | null>(null)

  // Fetch quizzes from API
  useEffect(() => {
    if (!user) return
    setIsLoading(true)
    Promise.all([
      getUserQuizzes(user._id),
      getSavedQuizzes(),
    ])
      .then(([created, saved]) => {
        setCreatedQuizzes(created)
        setSavedQuizzes(saved)
        setIsLoading(false)
      })
      .catch(() => {
        setCreatedQuizzes([])
        setSavedQuizzes([])
        setIsLoading(false)
        toast({ title: "Error", description: "Failed to load your quizzes" })
      })
  }, [user])

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await deleteQuiz(quizId)
      setCreatedQuizzes(createdQuizzes.filter((quiz) => quiz._id !== quizId))
      setQuizToDelete(null)
      toast({
        title: "Quiz deleted",
        description: "The quiz has been deleted successfully",
      })
    } catch {
      toast({
        title: "Failed to delete",
        description: "Could not delete the quiz.",
      })
    }
  }

  const handleShareQuiz = (quizId: string) => {
    const quizUrl = `${window.location.origin}/dashboard/quiz/preview/${quizId}`
    navigator.clipboard.writeText(quizUrl)
    toast({
      title: "Link copied",
      description: "Quiz link has been copied to clipboard",
    })
  }

  const handleToggleVisibility = async (quizId: string, isCurrentlyPublic: boolean) => {
    try {
      await updateQuizVisibility(quizId, !isCurrentlyPublic)
      setCreatedQuizzes(
        createdQuizzes.map((quiz) =>
          quiz._id === quizId ? { ...quiz, isPublic: !isCurrentlyPublic } : quiz,
        ),
      )
      toast({
        title: "Visibility updated",
        description: `Quiz is now ${!isCurrentlyPublic ? "public" : "private"}`,
      })
    } catch {
      toast({
        title: "Failed to update visibility",
        description: "Could not update quiz visibility.",
      })
    }
  }

  const handleRemoveSavedQuiz = async (quizId: string) => {
    setUnsavingQuizId(quizId)
    try {
      await unsaveQuiz(quizId)
      setSavedQuizzes(savedQuizzes.filter((quiz) => quiz._id !== quizId))
      toast({
        title: "Quiz removed",
        description: "The quiz has been removed from your saved quizzes",
      })
    } catch {
      toast({
        title: "Failed to remove",
        description: "Could not remove the quiz from saved quizzes.",
      })
    } finally {
      setUnsavingQuizId(null)
    }
  }

  // Filter quizzes based on search query
  const filteredCreatedQuizzes = createdQuizzes.filter((quiz) =>
    (quiz.topic ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSavedQuizzes = savedQuizzes.filter((quiz) =>
    (quiz.topic ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
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
                          <span>{quiz.questions?.length || 0} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {quiz.createdAt
                              ? new Date(quiz.createdAt).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.attempts ?? 0} attempts</span>
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
                              disabled={unsavingQuizId === quiz._id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> {unsavingQuizId === quiz._id ? "Removing..." : "Remove"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>
                        By {quiz.author ?? (quiz.createdBy?.name || "Unknown")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Brain className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.questions?.length || 0} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Saved {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : ""}
                          </span>
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
    </>
  )
}