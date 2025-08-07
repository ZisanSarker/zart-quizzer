"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import { FadeUp, ScaleIn } from "@/components/animations/motion"
import type { QuizAttemptResult } from "@/types/quiz"

interface QuizResultReviewProps {
  result: QuizAttemptResult
}

export function QuizResultReview({ result }: QuizResultReviewProps) {
  const quiz = result.quizId
  const questions = quiz.questions || []

  return (
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
  )
} 