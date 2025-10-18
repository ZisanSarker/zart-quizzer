"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { getQuizById, submitQuiz } from "@/lib/quiz"
import type { Quiz, QuizAnswer, QuizResult } from "@/types/quiz"

export function useQuizData() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuizById(params.id)
        // Normalize questions to ensure `questionText` exists for all cases
        const normalized = {
          ...quizData,
          questions: quizData.questions.map((q: any) => ({
            ...q,
            questionText:
              q?.questionText ??
              q?.question ??
              q?.title ??
              q?.text ??
              q?.statement ??
              q?.prompt ??
              "",
          })),
        }
        setQuiz(normalized)
        if (!quizData.timeLimit) setTimeLeft(0)
        setStartTime(Date.now())
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load quiz",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [params.id, toast])

  useEffect(() => {
    if (quizCompleted || !quiz || !quiz.timeLimit) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            return 30
          } else {
            handleFinishQuiz()
            clearInterval(timer)
            return 0
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion, quizCompleted, quiz])

  const handleAnswerSelect = (answer: string) => {
    if (!quiz) return
    setSelectedAnswers({
      ...selectedAnswers,
      [quiz.questions[currentQuestion]._id]: answer,
    })
  }

  const handleNextQuestion = () => {
    if (!quiz) return
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      if (quiz.timeLimit) setTimeLeft(30)
    } else {
      handleFinishQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      if (quiz && quiz.timeLimit) setTimeLeft(30)
    }
  }

  const handleFinishQuiz = async () => {
    if (!quiz || quizCompleted) return
    setQuizCompleted(true)
    try {
      const answers: QuizAnswer[] = Object.entries(selectedAnswers).map(([_id, selectedAnswer]) => ({
        _id,
        selectedAnswer,
      }))
      // Calculate time spent in seconds
      const timeSpentSeconds = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

      const result = await submitQuiz({
        quizId: quiz._id,
        userId: user?._id,
        answers,
        timeTaken: timeSpentSeconds,
      })
      setQuizResult(result)
      const attemptId = result.attemptId
      if (attemptId) {
        router.push(`/dashboard/quiz/result/${attemptId}`)
      } else {
        toast({
          title: "Quiz submitted",
          description: "Quiz completed. Unable to view result history due to missing attempt id.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      })
    }
  }

  const handleShareQuiz = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Quiz shared",
      description: "Quiz link copied to clipboard",
    })
  }

  return {
    quiz,
    loading,
    currentQuestion,
    selectedAnswers,
    timeLeft,
    quizCompleted,
    quizResult,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleFinishQuiz,
    handleShareQuiz
  }
} 