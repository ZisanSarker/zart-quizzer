"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import { ArrowLeft, ArrowRight, Award, Brain, CheckCircle, Clock, Share2, XCircle } from "lucide-react"
import { FadeIn, FadeUp, ScaleIn } from "@/components/animations/motion"
import { getQuizResultByAttemptId } from "@/lib/quiz"
import type { QuizAttemptResult } from "@/types/quiz"

export default function QuizResultPage() {
  const params = useParams() as { id: string }
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<QuizAttemptResult | null>(null)

  useEffect(() => {
    const fetchQuizResult = async () => {
      try {
        const data = await getQuizResultByAttemptId(params.id)
        setResult(data)
      } catch (error) {
        setResult(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuizResult()
  }, [params.id])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-center">
            <h2 className="text-2xl font-bold mb-2">Result is processing...</h2>
            <p className="text-muted-foreground">Please wait while we load your results</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!result) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Result not found</h2>
            <Button asChild>
              <Link href="/dashboard/history">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to History
              </Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const quiz = result.quizId
  const questions = quiz.questions || []
  const correctCount = result.answers.filter((a) => a.isCorrect).length
  const incorrectCount = questions.length - correctCount
  const accuracy = questions.length > 0 ? (correctCount / questions.length) * 100 : 0

  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Link href="/dashboard/history" className="flex items-center text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to History</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </Button>
            <GradientButton size="sm" asChild>
              <Link href={`/dashboard/quiz/practice/${quiz._id}`}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Retake Quiz
              </Link>
            </GradientButton>
          </div>
        </div>

        <FadeIn>
          <Card className="mb-6 overflow-hidden border-t-4 border-t-primary">
            <div className="bg-primary/5 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{quiz.topic} - {quiz.difficulty && quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}</h1>
                  <p className="text-muted-foreground">{quiz.description}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`text-4xl font-bold text-primary flex items-center gap-2`}>
                    <Award className="h-8 w-8" />
                    {Math.round(accuracy)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Your Score</div>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Questions</span>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span className="font-medium">{questions.length} Questions</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Score</span>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="font-medium">{result.score} / {questions.length}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Completed</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium">{result.submittedAt ? new Date(result.submittedAt).toLocaleString() : ""}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Accuracy</span>
                    <span className="font-medium">{Math.round(accuracy)}%</span>
                  </div>
                  <Progress value={accuracy} className="h-2" />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-900/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Correct Answers</span>
                    </div>
                    <div className="text-3xl font-bold text-green-500">{correctCount}</div>
                  </div>
                  <div className="flex-1 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Incorrect Answers</span>
                    </div>
                    <div className="text-3xl font-bold text-red-500">{incorrectCount}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeUp delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
              <CardDescription>Review your answers and explanations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {questions.map((question, index) => {
                  const answer = result.answers.find(a => String(a.questionId) === String(question._id));
                  const userWrong = answer && !answer.isCorrect;
                  return (
                    <ScaleIn key={question._id} delay={0.1 * index}>
                      <div
                        className={`p-4 rounded-lg border ${
                          answer && answer.isCorrect
                            ? "bg-green-50 border-green-100 dark:bg-green-950/20 dark:border-green-900/30"
                            : "bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-background">
                              Question {index + 1}
                            </Badge>
                            {answer?.isCorrect ? (
                              <Badge className="bg-green-500">Correct</Badge>
                            ) : (
                              <Badge className="bg-red-500">Incorrect</Badge>
                            )}
                          </div>
                        </div>
                        <div className="mb-4">
                          <h3 className="font-medium text-lg mb-2">{question.questionText}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {question.options.map((option, optionIndex) => {
                              const isCorrectOption = option === question.correctAnswer;
                              const isUserAnswer = answer && option === answer.selectedAnswer;
                              const showError = isUserAnswer && !answer?.isCorrect;
                              return (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-md border ${
                                    isCorrectOption
                                      ? "bg-green-100 border-green-200 dark:bg-green-950/30 dark:border-green-900/50"
                                      : showError
                                        ? "bg-red-100 border-red-200 dark:bg-red-950/30 dark:border-red-900/50"
                                        : "bg-muted/30 border-muted"
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    {isCorrectOption ? (
                                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    ) : showError ? (
                                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    ) : (
                                      <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {String.fromCharCode(65 + optionIndex)}
                                      </div>
                                    )}
                                    <span>{option}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {answer && !answer.isCorrect && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium text-red-500">Your answer:</span> {answer.selectedAnswer}
                              <br />
                              <span className="font-medium text-green-500">Correct answer:</span> {question.correctAnswer}
                            </div>
                          )}
                        </div>
                        <div className="bg-background p-3 rounded-md">
                          <h4 className="font-medium mb-1">Explanation</h4>
                          <p className="text-muted-foreground">{question.explanation}</p>
                        </div>
                      </div>
                    </ScaleIn>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
          <Button variant="outline" asChild>
            <Link href="/dashboard/history">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Link>
          </Button>
          <GradientButton asChild>
            <Link href={`/dashboard/quiz/preview/${quiz._id}`}>
              Retake Quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </GradientButton>
        </div>
      </div>
    </DashboardLayout>
  )
}

function Calendar(props: React.ComponentProps<typeof Clock>) {
  return <Clock {...props} />
}