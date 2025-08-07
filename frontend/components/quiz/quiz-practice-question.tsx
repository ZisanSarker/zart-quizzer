"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import { ScaleIn } from "@/components/animations/motion"
import type { QuizQuestion } from "@/types/quiz"

interface QuizPracticeQuestionProps {
  question: QuizQuestion
  index: number
  userAnswer: string | undefined
  checked: boolean
  isCorrect: boolean
  onOptionClick: (question: QuizQuestion, option: string) => void
}

export function QuizPracticeQuestion({ 
  question, 
  index, 
  userAnswer, 
  checked, 
  isCorrect, 
  onOptionClick 
}: QuizPracticeQuestionProps) {
  return (
    <ScaleIn delay={0.07 * index}>
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
                  onClick={() => onOptionClick(question, option)}
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
} 