"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { getUserQuizzes, getSavedQuizzes, unsaveQuiz } from "@/lib/quiz"

export function useLibraryData() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [createdQuizzes, setCreatedQuizzes] = useState<any[]>([])
  const [savedQuizzes, setSavedQuizzes] = useState<any[]>([])
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
  }, [user, toast])

  const handleShareQuiz = (quizId: string) => {
    const quizUrl = `${window.location.origin}/dashboard/quiz/preview/${quizId}`
    navigator.clipboard.writeText(quizUrl)
    toast({
      title: "Link copied",
      description: "Quiz link has been copied to clipboard",
    })
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

  return {
    isLoading,
    createdQuizzes,
    savedQuizzes,
    unsavingQuizId,
    handleShareQuiz,
    handleRemoveSavedQuiz
  }
} 