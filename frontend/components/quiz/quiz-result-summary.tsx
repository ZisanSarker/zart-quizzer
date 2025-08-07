"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Brain, CheckCircle, Clock, XCircle } from "lucide-react"
import { FadeIn } from "@/components/animations/motion"
import type { QuizAttemptResult } from "@/types/quiz"

interface QuizResultSummaryProps {
  result: QuizAttemptResult
}

export function QuizResultSummary({ result }: QuizResultSummaryProps) {
  const quiz = result.quizId
  const questions = quiz.questions || []
  const correctCount = result.answers.filter((a) => a.isCorrect).length
  const incorrectCount = questions.length - correctCount
  const accuracy = questions.length > 0 ? (correctCount / questions.length) * 100 : 0

  return (
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
                <Clock className="h-5 w-5 text-primary" />
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
  )
} 