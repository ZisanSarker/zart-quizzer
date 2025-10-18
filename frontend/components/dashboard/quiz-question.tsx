"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScaleIn } from "@/components/animations/motion"

interface QuizQuestionProps {
  question: any
  selectedAnswer: string
  onAnswerSelect: (answer: string) => void
  onNext: () => void
  onPrevious: () => void
  currentQuestion: number
  totalQuestions: number
  isLastQuestion: boolean
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  currentQuestion,
  totalQuestions,
  isLastQuestion
}: QuizQuestionProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  return (
    <ScaleIn>
      <Card className="w-full max-w-3xl mx-auto shadow-soft">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
            </div>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="space-y-1 mb-2">
            <span className="text-xs text-muted-foreground">Question</span>
            <div className="font-medium text-base sm:text-lg whitespace-pre-wrap break-words text-card-foreground">
              {question?.questionText ?? question?.question ?? question?.title ?? "No question text provided."}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedAnswer}
            onValueChange={onAnswerSelect}
            className="space-y-3"
          >
            {(question.options || []).map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button onClick={onNext}>
              {isLastQuestion ? "Finish Quiz" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </ScaleIn>
  )
} 