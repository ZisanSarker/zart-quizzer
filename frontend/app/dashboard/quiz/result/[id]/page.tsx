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

// Mock quiz result data
const quizResultMock = {
  id: "result123",
  quizId: "quiz456",
  quizTitle: "Mathematics - Calculus Fundamentals",
  quizDescription: "Essential concepts in differential and integral calculus",
  score: 85,
  totalQuestions: 10,
  correctAnswers: 8.5,
  timeTaken: "12:45",
  completedAt: "2023-06-15T14:30:00Z",
  category: "Mathematics",
  difficulty: "Advanced",
  questions: [
    {
      id: "q1",
      questionText: "What is the derivative of f(x) = x²?",
      options: ["f'(x) = x", "f'(x) = 2x", "f'(x) = 2", "f'(x) = x²"],
      correctAnswer: "f'(x) = 2x",
      userAnswer: "f'(x) = 2x",
      isCorrect: true,
      explanation: "The derivative of x² is 2x using the power rule.",
    },
    {
      id: "q2",
      questionText: "What is the integral of f(x) = 2x?",
      options: ["F(x) = x² + C", "F(x) = x² + 2C", "F(x) = x + C", "F(x) = 2x² + C"],
      correctAnswer: "F(x) = x² + C",
      userAnswer: "F(x) = x² + C",
      isCorrect: true,
      explanation: "The integral of 2x is x² + C.",
    },
    {
      id: "q3",
      questionText: "Which of the following is an application of integration?",
      options: [
        "Finding the rate of change",
        "Finding the area under a curve",
        "Finding the slope of a tangent line",
        "Finding the maximum value",
      ],
      correctAnswer: "Finding the area under a curve",
      userAnswer: "Finding the area under a curve",
      isCorrect: true,
      explanation: "Integration is used to find the area under a curve, among other applications.",
    },
    {
      id: "q4",
      questionText: "What is the derivative of sin(x)?",
      options: ["cos(x)", "-sin(x)", "tan(x)", "-cos(x)"],
      correctAnswer: "cos(x)",
      userAnswer: "cos(x)",
      isCorrect: true,
      explanation: "The derivative of sin(x) is cos(x).",
    },
    {
      id: "q5",
      questionText: "What is the chain rule used for?",
      options: [
        "Differentiating products",
        "Differentiating quotients",
        "Differentiating composite functions",
        "Integrating functions",
      ],
      correctAnswer: "Differentiating composite functions",
      userAnswer: "Differentiating composite functions",
      isCorrect: true,
      explanation: "The chain rule is used for differentiating composite functions.",
    },
    {
      id: "q6",
      questionText: "What is the second derivative of f(x) = x³?",
      options: ["f''(x) = 3x²", "f''(x) = 6x", "f''(x) = 6", "f''(x) = 3x"],
      correctAnswer: "f''(x) = 6x",
      userAnswer: "f''(x) = 3x²",
      isCorrect: false,
      explanation: "The first derivative is f'(x) = 3x², and the second derivative is f''(x) = 6x.",
    },
    {
      id: "q7",
      questionText: "What is the integral of e^x?",
      options: ["e^x + C", "e^x", "ln(x) + C", "xe^x + C"],
      correctAnswer: "e^x + C",
      userAnswer: "e^x + C",
      isCorrect: true,
      explanation: "The integral of e^x is e^x + C.",
    },
    {
      id: "q8",
      questionText: "What is the derivative of ln(x)?",
      options: ["1/x", "x", "ln(x)/x", "1/ln(x)"],
      correctAnswer: "1/x",
      userAnswer: "1/x",
      isCorrect: true,
      explanation: "The derivative of ln(x) is 1/x.",
    },
    {
      id: "q9",
      questionText: "What is the fundamental theorem of calculus?",
      options: [
        "The derivative of an integral equals the original function",
        "The integral of a derivative equals the original function plus a constant",
        "The derivative of a sum equals the sum of the derivatives",
        "The integral of a sum equals the sum of the integrals",
      ],
      correctAnswer: "The integral of a derivative equals the original function plus a constant",
      userAnswer: "The derivative of an integral equals the original function",
      isCorrect: false,
      explanation:
        "The fundamental theorem of calculus states that the integral of a derivative equals the original function plus a constant.",
    },
    {
      id: "q10",
      questionText: "What is the limit definition of the derivative?",
      options: [
        "f'(x) = lim(h→0) [f(x+h) - f(x)]/h",
        "f'(x) = lim(h→0) [f(x) - f(h)]/h",
        "f'(x) = lim(h→0) [f(x+h) + f(x)]/h",
        "f'(x) = lim(h→0) [f(x) + f(h)]/h",
      ],
      correctAnswer: "f'(x) = lim(h→0) [f(x+h) - f(x)]/h",
      userAnswer: "f'(x) = lim(h→0) [f(x+h) - f(x)]/h",
      isCorrect: true,
      explanation: "The limit definition of the derivative is f'(x) = lim(h→0) [f(x+h) - f(x)]/h.",
    },
  ],
  feedback: {
    strengths: ["Strong understanding of basic derivatives", "Good grasp of integration concepts"],
    weaknesses: ["Need to review the fundamental theorem of calculus", "Review second derivatives"],
    recommendations: [
      "Practice more problems on second derivatives",
      "Review the fundamental theorem of calculus",
      "Try more complex integration problems",
    ],
  },
}

export default function QuizResultPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState(quizResultMock)

  useEffect(() => {
    // Simulate API call to fetch quiz result
    const fetchQuizResult = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/quiz-results/${params.id}`);
        // const data = await response.json();

        // Using mock data for now
        const data = quizResultMock

        setResult(data)
      } catch (error) {
        console.error("Error fetching quiz result:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizResult()
  }, [params.id])

  // Calculate performance metrics
  const correctCount = result.questions.filter((q) => q.isCorrect).length
  const incorrectCount = result.questions.length - correctCount
  const accuracy = (correctCount / result.questions.length) * 100

  // Format time taken (mm:ss)
  const formatTime = (timeString: string) => {
    const [minutes, seconds] = timeString.split(":")
    return `${minutes}m ${seconds}s`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  // Get score color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-primary"
    if (score >= 50) return "text-amber-500"
    return "text-red-500"
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-center">
            <h2 className="text-2xl font-bold mb-2">Loading quiz results...</h2>
            <p className="text-muted-foreground">Please wait while we load your results</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

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
              <Link href={`/dashboard/quiz/practice/${result.quizId}`}>
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
                  <h1 className="text-2xl font-bold">{result.quizTitle}</h1>
                  <p className="text-muted-foreground">{result.quizDescription}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`text-4xl font-bold ${getScoreColor(result.score)} flex items-center gap-2`}>
                    <Award className="h-8 w-8" />
                    {result.score}%
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
                    <span className="font-medium">{result.totalQuestions} Questions</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Time Taken</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium">{formatTime(result.timeTaken)}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Completed</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium">{formatDate(result.completedAt)}</span>
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Performance Feedback</CardTitle>
              <CardDescription>Analysis of your quiz performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2 text-green-500 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> Strengths
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.feedback.strengths.map((strength, index) => (
                      <li key={index} className="text-muted-foreground">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-amber-500 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Areas for Improvement
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.feedback.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-muted-foreground">
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-primary flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" /> Recommendations
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.feedback.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-muted-foreground">
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
              <CardDescription>Review your answers and explanations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {result.questions.map((question, index) => (
                  <ScaleIn key={question.id} delay={0.1 * index}>
                    <div
                      className={`p-4 rounded-lg border ${
                        question.isCorrect
                          ? "bg-green-50 border-green-100 dark:bg-green-950/20 dark:border-green-900/30"
                          : "bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-background">
                            Question {index + 1}
                          </Badge>
                          {question.isCorrect ? (
                            <Badge className="bg-green-500">Correct</Badge>
                          ) : (
                            <Badge className="bg-red-500">Incorrect</Badge>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-medium text-lg mb-2">{question.questionText}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-md border ${
                                option === question.correctAnswer
                                  ? "bg-green-100 border-green-200 dark:bg-green-950/30 dark:border-green-900/50"
                                  : option === question.userAnswer && !question.isCorrect
                                    ? "bg-red-100 border-red-200 dark:bg-red-950/30 dark:border-red-900/50"
                                    : "bg-muted/30 border-muted"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                {option === question.correctAnswer ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                ) : option === question.userAnswer && !question.isCorrect ? (
                                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {String.fromCharCode(65 + optionIndex)}
                                  </div>
                                )}
                                <span>{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-background p-3 rounded-md">
                        <h4 className="font-medium mb-1">Explanation</h4>
                        <p className="text-muted-foreground">{question.explanation}</p>
                      </div>
                    </div>
                  </ScaleIn>
                ))}
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
            <Link href={`/dashboard/quiz/practice/${result.quizId}`}>
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

function AlertTriangle(props: React.ComponentProps<typeof XCircle>) {
  return <XCircle {...props} />
}

function Lightbulb(props: React.ComponentProps<typeof Brain>) {
  return <Brain {...props} />
}
