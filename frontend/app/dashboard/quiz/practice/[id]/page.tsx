"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Share2, Star } from "lucide-react"
import { getQuizById, submitQuiz } from "@/lib/quiz"
import { rateQuiz, getQuizRatingStats } from "@/lib/rating"
import type { Quiz, QuizQuestion, QuizAnswer } from "@/types/quiz"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { FadeIn, ScaleIn } from "@/components/animations/motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

function RatingStars({
  quizId,
  userId,
  onRated,
  initialValue = 0,
}: {
  quizId: string
  userId?: string
  onRated?: (value: number) => void
  initialValue?: number
}) {
  const [rating, setRating] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch current user rating on component mount
  useEffect(() => {
    const fetchUserRating = async () => {
      if (userId && quizId) {
        try {
          const data = await getQuizRatingStats(quizId)
          if (data.userRating) {
            setRating(data.userRating)
          }
        } catch (error) {
          console.error('Failed to fetch user rating:', error)
        }
      }
    }
    fetchUserRating()
  }, [userId, quizId])

  const handleRate = async (r: number) => {
    if (!userId) return
    setLoading(true)
    setRating(r)
    try {
      await rateQuiz(quizId, r)
      toast({ 
        title: r === rating ? "Rating updated!" : "Thank you for rating!",
        description: r === rating ? "Your rating has been updated." : "Your rating has been saved."
      })
      if (onRated) onRated(r)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to rate"
      toast({ 
        title: "Rating failed", 
        description: errorMessage,
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
        <div className="relative">
          <button
            key={i}
            type="button"
            aria-label={`Rate ${i}`}
            disabled={loading}
            onClick={() => handleRate(i)}
            className={`transition-all duration-300 group ${
              i <= rating 
                ? "text-amber-500 scale-110" 
                : "text-gray-300 dark:text-gray-600 scale-100 hover:text-amber-400 dark:hover:text-amber-400"
            } hover:scale-125`}
          >
            <Star 
              className={`h-10 w-10 transition-all duration-300 ${
                i <= rating 
                  ? "fill-amber-500 drop-shadow-lg" 
                  : "fill-none group-hover:fill-amber-200 dark:group-hover:fill-amber-800"
              }`} 
            />
            {i <= rating && (
              <div className="absolute inset-0 animate-pulse">
                <Star className="h-10 w-10 text-amber-400 fill-amber-400 opacity-30" />
              </div>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}

export default function QuizPracticeAllPage({ params }: { params: { id: string } }) {
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
        const quizData = await getQuizById(params.id)
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
  }, [params.id, toast, user])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-2">Loading quiz...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your quiz</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz not found</h2>
          <p className="text-muted-foreground mb-4">The quiz you're looking for doesn't exist or has been removed</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight gradient-heading">
          Practice: {quiz.topic}
        </h1>
        <div className="flex items-center gap-2">
          {/* Enhanced Rate Quiz Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRateButtonClick}
            className={`
              flex items-center gap-2 transition-all duration-300 transform hover:scale-105 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm
              ${showRateButton 
                ? hasRated
                  ? "bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                  : "bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 dark:from-amber-950/30 dark:to-yellow-950/30 dark:hover:from-amber-950/50 dark:hover:to-yellow-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 shadow-md hover:shadow-lg rate-button-glow"
                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-950/30 dark:hover:bg-gray-950/50 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400"
              }
              ${showRateButton && !hasRated ? "rate-button-pulse" : ""}
            `}
            disabled={!showRateButton}
            title={
              !showRateButton 
                ? quiz?.createdBy === user?._id 
                  ? "You cannot rate your own quiz" 
                  : "This quiz is not public"
                : hasRated 
                  ? "You have already rated this quiz" 
                  : "Rate this public quiz"
            }
          >
            <Star className={`h-4 w-4 transition-all duration-300 ${
              showRateButton && !hasRated ? "star-bounce" : ""
            }`} />
            {showRateButton 
              ? hasRated 
                ? "Rated ✓" 
                : "Rate Quiz"
              : quiz?.createdBy === user?._id 
                ? "Your Quiz" 
                : "Private Quiz"
            }
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleShareQuiz} className="min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm">
            <Share2 className="mr-2 h-4 w-4" /> Share Quiz
          </Button>
        </div>
      </div>

      <FadeIn>
        <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
          {quiz.questions.map((question, index) => {
            const userAnswer = selectedAnswers[question._id]
            const checked = checkedAnswers[question._id]
            const isCorrect = userAnswer === question.correctAnswer
            return (
              <ScaleIn key={question._id} delay={0.07 * index}>
                <Card
                  className={`overflow-hidden border-t-4 ${
                    checked
                      ? isCorrect
                        ? "border-t-green-500 bg-green-50 dark:bg-green-950/20"
                        : "border-t-red-500 bg-red-50 dark:bg-red-950/20"
                      : "border-t-primary/40"
                  }`}
                >
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-background text-xs sm:text-sm">
                        Question {index + 1}
                      </Badge>
                      {checked && (
                        isCorrect
                          ? <Badge className="bg-green-500 text-xs sm:text-sm">Correct</Badge>
                          : <Badge className="bg-red-500 text-xs sm:text-sm">Incorrect</Badge>
                      )}
                    </div>
                    <CardTitle className="text-base sm:text-lg">{question.questionText}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      {question.options.map((option, optionIdx) => {
                        const isOptionCorrect = option === question.correctAnswer
                        const isUserSelected = userAnswer === option
                        const showError = checked && isUserSelected && !isCorrect
                        return (
                          <button
                            key={optionIdx}
                            type="button"
                            className={`
                              group flex items-start gap-2 p-3 rounded-md border w-full text-left transition-all duration-150 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base
                              ${checked
                                ? isOptionCorrect
                                  ? "bg-green-100 border-green-200 dark:bg-green-950/30 dark:border-green-900/50"
                                  : showError
                                    ? "bg-red-100 border-red-200 dark:bg-red-950/30 dark:border-red-900/50"
                                    : "bg-muted/30 border-muted"
                                : "hover:border-primary-300 hover:text-primary-500"
                              }
                              ${isUserSelected && !checked ? "ring-2 ring-primary border-primary" : ""}
                              ${checked ? "cursor-not-allowed" : "cursor-pointer"}
                            `}
                            disabled={checked}
                            onClick={() => handleOptionClick(question, option)}
                          >
                            <span className="flex-shrink-0 mt-0.5">
                              {checked ? (
                                isOptionCorrect ? (
                                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                ) : showError ? (
                                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                                ) : (
                                  <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border border-muted-foreground flex items-center justify-center text-xs sm:text-sm">
                                    {String.fromCharCode(65 + optionIdx)}
                                  </div>
                                )
                              ) : (
                                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border border-muted-foreground flex items-center justify-center text-xs sm:text-sm">
                                  {String.fromCharCode(65 + optionIdx)}
                                </div>
                              )}
                            </span>
                            <span>{option}</span>
                          </button>
                        )
                      })}
                    </div>

                    {checked && (
                      <div className="mt-3 text-xs sm:text-sm">
                        {!isCorrect && (
                          <div className="mb-2">
                            <span className="font-medium text-red-500">Your answer:</span> {userAnswer}
                            <br />
                            <span className="font-medium text-green-500">Correct answer:</span> {question.correctAnswer}
                          </div>
                        )}
                        <div className="bg-background p-3 rounded-md">
                          <span className="font-medium">Explanation:</span> <span className="text-muted-foreground">{question.explanation}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScaleIn>
            )
          })}
        </div>
      </FadeIn>

      <div className="flex flex-col items-center max-w-3xl mx-auto mt-8 sm:mt-12 mb-6 gap-3">
        <div className="flex flex-col sm:flex-row justify-end w-full gap-3">
          <GradientButton onClick={handleResetPractice} className="min-h-[44px] sm:min-h-[40px] text-sm sm:text-base">
            Reset Practice
          </GradientButton>
          <Button
            variant="default"
            onClick={handleFinishPractice}
            disabled={practiceSubmitted}
            className="min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
          >
            {practiceSubmitted ? "Practice Saved" : "Finish Practice"}
          </Button>
        </div>
      </div>

      {/* Enhanced Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={open => { if (!open) setShowRatingModal(false) }}>
        <DialogContent className="max-w-md bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800">
          <DialogHeader>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <DialogTitle className="text-xl font-bold text-amber-800 dark:text-amber-200">
                Rate this Quiz
              </DialogTitle>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                How would you rate "{quiz.topic}"?
              </p>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 my-4">
            <RatingStars
              quizId={quiz._id}
              userId={user?._id}
              onRated={handleRated}
            />
            <div className="text-center">
              <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                Your feedback helps improve future quizzes!
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Click on a star to rate from 1 to 5 • You can update your rating anytime
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-center gap-2">
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                onClick={handleModalClose}
                className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50"
              >
                Skip for now
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}