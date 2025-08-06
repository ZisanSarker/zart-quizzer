"use client"

import { useState, useEffect } from "react"
import { getRecentQuizAttempts } from "@/lib/quiz"
import type { RecentQuizAttempt } from "@/types/quiz"

export function useHistoryData() {
  const [isLoading, setIsLoading] = useState(true)
  const [quizHistory, setQuizHistory] = useState<RecentQuizAttempt[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getRecentQuizAttempts()
        setQuizHistory(data)
      } catch (error: any) {
        console.error("Failed to fetch history:", error)
        setError("Failed to fetch quiz history.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Derived: performance by topic
  const performanceByTopic = (() => {
    const topicMap: Record<string, { attempts: number; totalScore: number }> = {}
    quizHistory.forEach((item) => {
      const topic = item.quizTitle || "Unknown"
      if (!topicMap[topic]) topicMap[topic] = { attempts: 0, totalScore: 0 }
      topicMap[topic].attempts += 1
      topicMap[topic].totalScore += Number(item.score) || 0
    })
    return Object.entries(topicMap).map(
      ([topic, { attempts, totalScore }]) => ({
        topic,
        attempts,
        averageScore: attempts ? Math.round(totalScore / attempts) : 0,
      })
    )
  })()

  // Derived: achievements
  const achievements = (() => {
    const list: {
      id: string
      title: string
      description: string
      date: string
    }[] = []
    
    // Perfect Score
    const perfect = quizHistory.find((q) => q.score === 100)
    if (perfect)
      list.push({
        id: "perfect",
        title: "Perfect Score",
        description: `Achieved 100% on "${perfect.quizTitle}"`,
        date: perfect.completedAt,
      })
    
    // Completed 10 quizzes
    if (quizHistory.length >= 10) {
      list.push({
        id: "quizmaster",
        title: "Quiz Master",
        description: "Completed 10 quizzes",
        date:
          quizHistory[9]?.completedAt ||
          quizHistory[quizHistory.length - 1]?.completedAt,
      })
    }
    
    // Improved score
    let improvement: {
      title: string
      prev: RecentQuizAttempt
      curr: RecentQuizAttempt
    } | null = null
    const quizMap: Record<string, RecentQuizAttempt[]> = {}
    quizHistory.forEach((q) => {
      if (!quizMap[q.quizId]) quizMap[q.quizId] = []
      quizMap[q.quizId].push(q)
    })
    for (const attempts of Object.values(quizMap)) {
      if (attempts.length > 1) {
        const sorted = [...attempts].sort(
          (a, b) =>
            new Date(a.completedAt).getTime() -
            new Date(b.completedAt).getTime()
        )
        for (let i = 1; i < sorted.length; ++i) {
          if (sorted[i].score > sorted[i - 1].score) {
            improvement = {
              title: sorted[i].quizTitle,
              prev: sorted[i - 1],
              curr: sorted[i],
            }
            break
          }
        }
      }
      if (improvement) break
    }
    if (improvement) {
      list.push({
        id: "improve",
        title: "Fast Learner",
        description: `Improved score on "${improvement.title}" from ${improvement.prev.score}% to ${improvement.curr.score}%`,
        date: improvement.curr.completedAt,
      })
    }
    
    return list
  })()

  return {
    isLoading,
    quizHistory,
    error,
    performanceByTopic,
    achievements
  }
} 