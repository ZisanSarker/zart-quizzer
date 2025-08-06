"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { getExploreQuizzes, saveQuiz } from "@/lib/quiz"
import type { ExploreQuiz } from "@/types/quiz"

const PAGE_SIZE = 10

export function useExploreData() {
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
  }

  return {
    isLoading,
    publicQuizzes,
    savingQuizId,
    activeTab,
    currentPage,
    totalPages,
    pagedQuizzes,
    handleSaveQuiz,
    handlePageChange,
    handleTabChange
  }
} 