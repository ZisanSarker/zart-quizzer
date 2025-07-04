"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Share2 } from "lucide-react"
import { getQuizById, submitQuiz } from "@/lib/quiz"
import type { Quiz, QuizAnswer, QuizResult } from "@/types/quiz"
import { useAuth } from "@/contexts/auth-context"
import { FadeIn, ScaleIn } from "@/components/animations/motion"

export default function QuizPreviewPage() {
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
        setQuiz(quizData)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">
          {quizCompleted ? "Quiz Results is Loading" : quiz.topic}
        </h1>
        {!quizCompleted && (
          <Button variant="outline" size="sm" onClick={handleShareQuiz}>
            <Share2 className="mr-2 h-4 w-4" /> Share Quiz
          </Button>
        )}
      </div>

      {!quizCompleted ? (
        <ScaleIn>
          <Card className="w-full max-w-3xl mx-auto shadow-soft">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                  </span>
                </div>
                {quiz.timeLimit && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className={`text-sm font-medium ${timeLeft <= 5 ? "text-red-500 animate-pulse" : ""}`}>
                      {timeLeft}s
                    </span>
                  </div>
                )}
              </div>
              <Progress value={progress} className="h-2" />
              <CardTitle className="mt-4 text-xl">{question.questionText}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswers[question._id]}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 rounded-md border p-2 sm:p-3 transition-all duration-200 hover:border-primary-300 hover:text-primary-500"
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} className="text-primary border-primary-300" />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <GradientButton onClick={handleNextQuestion} disabled={!selectedAnswers[question._id]}>
                {currentQuestion < quiz.questions.length - 1 ? (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Finish Quiz"
                )}
              </GradientButton>
            </CardFooter>
          </Card>
        </ScaleIn>
      ) : null}
    </>
  )
}