"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getRecentQuizAttempts, getRecommendedQuizzes } from "@/lib/quiz"
import { getMyStats } from "@/lib/stats"
import type { RecentQuizAttempt, RecommendedQuiz } from "@/types/quiz"
import type { UserStats } from "@/types/stats"

export function useDashboardData() {
  const { user, isLoading } = useAuth()
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuizAttempt[]>([])
  const [recommendedQuizzes, setRecommendedQuizzes] = useState<RecommendedQuiz[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [quizError, setQuizError] = useState<string | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)

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
      setIsLoadingData(true)
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
      } finally {
        setIsLoadingData(false)
      }
    }
    if (user) {
      console.log('👤 User authenticated, fetching quiz data...')
      fetchData()
    } else {
      console.log('❌ User not authenticated, skipping quiz data fetch')
    }
  }, [user])

  return {
    user,
    isLoading,
    recentQuizzes,
    recommendedQuizzes,
    stats,
    statsError,
    quizError,
    isLoadingData
  }
} 