"use client"

import { useState, useEffect } from "react"
import { getQuizResultByAttemptId } from "@/lib/quiz"
import type { QuizAttemptResult } from "@/types/quiz"

export function useQuizResultData(attemptId: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<QuizAttemptResult | null>(null)

  useEffect(() => {
    const fetchQuizResult = async () => {
      try {
        const data = await getQuizResultByAttemptId(attemptId)
        setResult(data)
      } catch (error) {
        setResult(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuizResult()
  }, [attemptId])

  return {
    isLoading,
    result
  }
} 