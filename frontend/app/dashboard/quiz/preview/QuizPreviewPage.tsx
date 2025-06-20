"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Share2 } from "lucide-react"
import { getQuizById } from "@/lib/quiz"
import type { Quiz } from "@/types/quiz"

export default function QuizPreviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const quizId = searchParams.get("id")
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    if (!quizId) {
      setLoading(false)
      return
    }
    getQuizById(quizId)
      .then((quizData) => {
        setQuiz(quizData)
        if (!quizData.timeLimit) setTimeLeft(0)
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to load quiz",
          variant: "destructive",
        })
      })
      .finally(() => setLoading(false))
  }, [quizId, toast])

  useEffect(() => {
    if (quizCompleted || !quiz || !quiz.timeLimit) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            return 30
          } else {
            setQuizCompleted(true)
            clearInterval(timer)
            return 0
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion, quizCompleted, quiz])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-center">
            <h2 className="text-2xl font-bold mb-2">Loading quiz...</h2>
            <p className="text-muted-foreground">Please wait while we prepare your quiz</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Quiz not found</h2>
            <p className="text-muted-foreground mb-4">The quiz you're looking for doesn't exist or has been removed</p>
            <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [question._id]: answer,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      if (quiz.timeLimit) setTimeLeft(30)
    } else {
      setQuizCompleted(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      if (quiz.timeLimit) setTimeLeft(30)
    }
  }

  const handleShareQuiz = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Quiz shared",
      description: "Quiz link copied to clipboard",
    })
  }

  const calculateScore = () => {
    let correctCount = 0
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q._id] === q.correctAnswer) {
        correctCount++
      }
    })
    return {
      score: correctCount,
      total: quiz.questions.length,
      percentage: Math.round((correctCount / quiz.questions.length) * 100),
    }
  }

  const score = calculateScore()

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{quizCompleted ? "Quiz Results" : "Quiz Preview"}</h1>
        {!quizCompleted && (
          <Button variant="outline" size="sm" onClick={handleShareQuiz}>
            <Share2 className="mr-2 h-4 w-4" /> Share Quiz
          </Button>
        )}
      </div>

      {!quizCompleted ? (
        <Card className="max-w-3xl mx-auto">
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
                  <span className="text-sm font-medium">{timeLeft}s</span>
                </div>
              )}
            </div>
            <Progress value={progress} className="h-2" />
            <CardTitle className="mt-4 text-xl">{question.questionText}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedAnswers[question._id]} onValueChange={handleAnswerSelect} className="space-y-3">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={handleNextQuestion} disabled={!selectedAnswers[question._id]}>
              {currentQuestion < quiz.questions.length - 1 ? (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Finish Quiz"
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Quiz Completed!</CardTitle>
              <CardDescription>
                You scored {score.score} out of {score.total} ({score.percentage}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quiz.questions.map((q, index) => {
                  const isCorrect = selectedAnswers[q._id] === q.correctAnswer
                  return (
                    <div key={q._id} className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div
                          className={`rounded-full p-1 ${isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="h-4 w-4 flex items-center justify-center text-xs">✕</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            Question {index + 1}: {q.questionText}
                          </h3>
                          <div className="text-sm mt-1">
                            <span className="font-medium">Your answer:</span> {selectedAnswers[q._id] || "Not answered"}
                          </div>
                          <div className="text-sm mt-1">
                            <span className="font-medium">Correct answer:</span> {q.correctAnswer}
                          </div>
                          <div className="text-sm mt-2 p-2 bg-muted rounded-md">
                            <span className="font-medium">Explanation:</span> {q.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button onClick={handleShareQuiz}>
                <Share2 className="mr-2 h-4 w-4" /> Share Results
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}