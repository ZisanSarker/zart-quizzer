"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import { CheckCircle, XCircle, Share2 } from "lucide-react"
import { getQuizById, submitQuiz } from "@/lib/quiz"
import type { Quiz, QuizQuestion, QuizAnswer } from "@/types/quiz"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { FadeIn, ScaleIn } from "@/components/animations/motion"

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

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const quizData = await getQuizById(params.id)
        setQuiz(quizData)
        setStartTime(Date.now())
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
    fetchQuiz()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, toast])

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
      router.push("/dashboard/library")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit practice stats.",
        variant: "destructive",
      })
    }
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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">
          Practice: {quiz.topic}
        </h1>
        <Button variant="outline" size="sm" onClick={handleShareQuiz}>
          <Share2 className="mr-2 h-4 w-4" /> Share Quiz
        </Button>
      </div>

      <FadeIn>
        <div className="space-y-8 max-w-3xl mx-auto">
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
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-background">
                        Question {index + 1}
                      </Badge>
                      {checked && (
                        isCorrect
                          ? <Badge className="bg-green-500">Correct</Badge>
                          : <Badge className="bg-red-500">Incorrect</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{question.questionText}</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                              group flex items-start gap-2 p-3 rounded-md border w-full text-left transition-all duration-150
                              ${checked
                                ? isOptionCorrect
                                  ? "bg-green-100 border-green-200 dark:bg-green-950/30 dark:border-green-900/50"
                                  : showError
                                    ? "bg-red-100 border-red-200 dark:bg-red-950/30 dark:border-red-900/50"
                                    : "bg-muted/30 border-muted"
                                : "hover:border-primary-300 hover:bg-primary-50"
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
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : showError ? (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center">
                                    {String.fromCharCode(65 + optionIdx)}
                                  </div>
                                )
                              ) : (
                                <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center">
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
                      <div className="mt-3 text-sm">
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

      <div className="flex justify-end items-center max-w-3xl mx-auto mt-12 mb-6 gap-3">
        <GradientButton onClick={handleResetPractice}>
          Reset Practice
        </GradientButton>
        <Button
          variant="default"
          onClick={handleFinishPractice}
          disabled={practiceSubmitted}
        >
          {practiceSubmitted ? "Practice Saved" : "Finish Practice"}
        </Button>
      </div>
    </DashboardLayout>
  )
}