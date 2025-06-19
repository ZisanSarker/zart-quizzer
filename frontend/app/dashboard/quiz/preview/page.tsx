"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Share2 } from "lucide-react"

// Mock quiz data
const quizData = {
  title: "Mathematics Quiz",
  description: "Test your knowledge of basic mathematics concepts",
  questions: [
    {
      id: 1,
      question: "What is the value of π (pi) to two decimal places?",
      options: ["3.14", "3.16", "3.12", "3.18"],
      correctAnswer: "3.14",
      explanation:
        "Pi (π) is approximately equal to 3.14159..., which rounds to 3.14 when expressed to two decimal places.",
    },
    {
      id: 2,
      question: "If a triangle has angles measuring 60°, 60°, and 60°, what type of triangle is it?",
      options: ["Scalene", "Isosceles", "Equilateral", "Right-angled"],
      correctAnswer: "Equilateral",
      explanation: "An equilateral triangle has all three angles equal to 60° and all three sides of equal length.",
    },
    {
      id: 3,
      question: "What is the result of 7² - 3² ?",
      options: ["40", "16", "4", "10"],
      correctAnswer: "40",
      explanation: "7² - 3² = 49 - 9 = 40",
    },
    {
      id: 4,
      question: "If f(x) = 2x + 3, what is the value of f(4)?",
      options: ["7", "8", "11", "14"],
      correctAnswer: "11",
      explanation: "f(4) = 2(4) + 3 = 8 + 3 = 11",
    },
    {
      id: 5,
      question: "What is the area of a circle with radius 5 units?",
      options: ["25π square units", "10π square units", "5π square units", "15π square units"],
      correctAnswer: "25π square units",
      explanation: "The area of a circle is πr². With r = 5, the area is π(5)² = 25π square units.",
    },
  ],
}

export default function QuizPreviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const question = quizData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [question.id]: answer,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(30)
    } else {
      setQuizCompleted(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setTimeLeft(30)
    }
  }

  const handleShareQuiz = () => {
    toast({
      title: "Quiz shared",
      description: "Quiz link copied to clipboard",
    })
  }

  const calculateScore = () => {
    let correctCount = 0
    quizData.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++
      }
    })
    return {
      score: correctCount,
      total: quizData.questions.length,
      percentage: Math.round((correctCount / quizData.questions.length) * 100),
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
                  Question {currentQuestion + 1} of {quizData.questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{timeLeft}s</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <CardTitle className="mt-4 text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedAnswers[question.id]} onValueChange={handleAnswerSelect} className="space-y-3">
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
            <Button onClick={handleNextQuestion} disabled={!selectedAnswers[question.id]}>
              {currentQuestion < quizData.questions.length - 1 ? (
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
                {quizData.questions.map((q, index) => {
                  const isCorrect = selectedAnswers[q.id] === q.correctAnswer

                  return (
                    <div key={q.id} className="space-y-3">
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
                            Question {index + 1}: {q.question}
                          </h3>
                          <div className="text-sm mt-1">
                            <span className="font-medium">Your answer:</span> {selectedAnswers[q.id] || "Not answered"}
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
