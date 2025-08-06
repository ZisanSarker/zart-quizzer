"use client"

import { useState, useEffect } from "react"
import { getTrendingQuizzes } from "@/lib/quiz"
import type { ExploreQuiz } from "@/types/quiz"

export function useHomeData() {
  const [trendingQuizzes, setTrendingQuizzes] = useState<ExploreQuiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendingQuizzes = async () => {
      try {
        setLoading(true)
        const quizzes = await getTrendingQuizzes(3)
        setTrendingQuizzes(quizzes)
      } catch (err) {
        setError("Failed to fetch trending quizzes.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingQuizzes()
    const interval = setInterval(fetchTrendingQuizzes, 300000) // Fetch every 5 minutes
    return () => clearInterval(interval)
  }, [])

  return {
    trendingQuizzes,
    loading,
    error
  }
} 