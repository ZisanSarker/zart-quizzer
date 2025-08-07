"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { getQuizById, submitQuiz } from "@/lib/quiz"
import { rateQuiz, getQuizRatingStats } from "@/lib/rating"
import type { Quiz, QuizQuestion, QuizAnswer } from "@/types/quiz"

export function useQuizPracticeData(quizId: string) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({})
  const [startTime, setStartTime] = useState<number | null>(null)
  const [practiceSubmitted, setPracticeSubmitted] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showRateButton, setShowRateButton] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [pendingRedirect, setPendingRedirect] = useState(false)
  const [canRate, setCanRate] = useState(false)

  useEffect(() => {
    async function fetchQuizAndUserRating() {
      try {
        const quizData = await getQuizById(quizId)
        setQuiz(quizData)
        setStartTime(Date.now())
        
        // Check if user can rate this quiz (not their own quiz and must be public)
        if (user && quizData?._id) {
          const isOwnQuiz = quizData.createdBy === user._id
          const isPublicQuiz = quizData.isPublic === true
          const canRateQuiz = !isOwnQuiz && isPublicQuiz
          
          setCanRate(canRateQuiz)
          setShowRateButton(canRateQuiz)
          
          if (canRateQuiz) {
            const data = await getQuizRatingStats(quizData._id)
            setHasRated(Boolean(data.userRating))
          }
        }
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to load quiz",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchQuizAndUserRating()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, toast, user])

  // When redirect is pending and modal is closed, go to dashboard
  useEffect(() => {
    if (pendingRedirect && !showRatingModal) {
      router.push("/dashboard")
    }
  }, [pendingRedirect, showRatingModal, router])

  const handleOptionClick = (question: QuizQuestion, option: string) => {
    if (checkedAnswers[question._id]) return
    setSelectedAnswers((prev) => ({ ...prev, [question._id]: option }))
    setCheckedAnswers((prev) => ({ ...prev, [question._id]: true }))
  }

  const handleShareQuiz = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Quiz shared",
      description: "Quiz link copied to clipboard",
    })
  }

  const handleResetPractice = () => {
    setSelectedAnswers({})
    setCheckedAnswers({})
    setStartTime(Date.now())
    setPracticeSubmitted(false)
    setShowRatingModal(false)
    setPendingRedirect(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFinishPractice = async () => {
    if (!quiz || practiceSubmitted) return
    setPracticeSubmitted(true)
    try {
      const answers: QuizAnswer[] = Object.entries(selectedAnswers).map(([_id, selectedAnswer]) => ({
        _id,
        selectedAnswer,
      }))
      const timeSpentSeconds = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
      await submitQuiz({
        quizId: quiz._id,
        userId: user?._id,
        answers,
        timeTaken: timeSpentSeconds,
      })
      toast({
        title: "Practice session logged!",
        description: "Your practice has been saved in your statistics.",
      })
      
      // Show rating modal if user can rate and hasn't rated yet
      if (canRate && !hasRated && user) {
        setShowRatingModal(true)
        setPendingRedirect(true)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit practice stats.",
        variant: "destructive",
      })
    }
  }

  const handleModalClose = () => {
    setShowRatingModal(false)
    if (pendingRedirect) {
      // will trigger redirect via useEffect
      setPendingRedirect(true)
    }
  }

  const handleRated = () => {
    setHasRated(true)
    setShowRatingModal(false)
    if (pendingRedirect) {
      // will trigger redirect via useEffect
      setPendingRedirect(true)
    }
  }

  const handleRateClick = () => {
    if (canRate && !hasRated) {
      setShowRatingModal(true)
    }
  }

  const handleRateButtonClick = () => {
    if (!quiz || !user) return

    const isOwnQuiz = quiz.createdBy === user._id
    const isPublicQuiz = quiz.isPublic === true

    if (isOwnQuiz) {
      toast({
        title: "Cannot rate your own quiz",
        description: "You can only rate quizzes created by other users.",
        variant: "destructive",
      })
      return
    }

    if (!isPublicQuiz) {
      toast({
        title: "Cannot rate private quiz",
        description: "You can only rate public quizzes.",
        variant: "destructive",
      })
      return
    }

    // Allow rating (multiple ratings are supported, latest one counts)
    setShowRatingModal(true)
  }

  return {
    quiz,
    loading,
    selectedAnswers,
    checkedAnswers,
    practiceSubmitted,
    showRatingModal,
    showRateButton,
    hasRated,
    canRate,
    handleOptionClick,
    handleShareQuiz,
    handleResetPractice,
    handleFinishPractice,
    handleModalClose,
    handleRated,
    handleRateClick,
    handleRateButtonClick,
    setShowRatingModal
  }
} 