"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
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

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuizById(params.id)
        setQuiz(quizData)
        if (!quizData.timeLimit) setTimeLeft(0)
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
    // Only apply timer if timeLimit is enabled
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
    if (!quiz) return
    try {
      const answers: QuizAnswer[] = Object.entries(selectedAnswers).map(([_id, selectedAnswer]) => ({
        _id,
        selectedAnswer,
      }))
      const result = await submitQuiz({
        quizId: quiz._id,
        userId: user?._id,
        answers,
      })
      setQuizResult(result)
      setQuizCompleted(true)
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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">
          {quizCompleted ? "Quiz Results" : quiz.topic}
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
                    className="flex items-center space-x-2 rounded-md border p-2 sm:p-3 transition-all duration-200 hover:border-primary-300 hover:bg-primary-500"
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
      ) : (
        <FadeIn>
          <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <Card className="shadow-soft">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="gradient-heading">Quiz Completed!</CardTitle>
                <CardDescription>
                  You scored {quizResult?.score} out of {quizResult?.total} (
                  {quizResult?.total ? Math.round((quizResult?.score / quizResult?.total) * 100) : 0}%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quizResult?.result.map((result, index) => {
                    const question = quiz.questions.find((q) => q._id === result.questionId)
                    return (
                      <div key={result.questionId} className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div
                            className={`rounded-full p-1 ${result.isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                          >
                            {result.isCorrect ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="h-4 w-4 flex items-center justify-center text-xs">✕</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              Question {index + 1}: {question?.questionText}
                            </h3>
                            <div className="text-sm mt-1">
                              <span className="font-medium">Your answer:</span> {result.selectedAnswer}
                            </div>
                            <div className="text-sm mt-1">
                              <span className="font-medium">Correct answer:</span> {result.correctAnswer}
                            </div>
                            <div className="text-sm mt-2 p-2 bg-muted rounded-md">
                              <span className="font-medium">Explanation:</span> {result.explanation}
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
        </FadeIn>
      )}
    </DashboardLayout>
  )
}