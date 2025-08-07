"use client"

interface QuizCardStatsProps {
  totalQuestions?: number
  correctAnswers?: number
  averageRating?: number
}

export function QuizCardStats({ totalQuestions, correctAnswers, averageRating }: QuizCardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {totalQuestions !== undefined && (
        <div className="text-center">
          <div className="text-xl font-bold text-primary">
            {totalQuestions}
          </div>
          <div className="text-xs text-muted-foreground">Questions</div>
        </div>
      )}
      {correctAnswers !== undefined && (
        <div className="text-center">
          <div className="text-xl font-bold text-primary">
            {correctAnswers}
          </div>
          <div className="text-xs text-muted-foreground">Correct</div>
        </div>
      )}
      {averageRating !== undefined && (
        <div className="text-center">
          <div className="text-xl font-bold text-primary">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground">Rating</div>
        </div>
      )}
      {averageRating !== undefined && (
        <div className="text-center">
          <div className="text-xl font-bold text-primary">
            ⭐
          </div>
          <div className="text-xs text-muted-foreground">Stars</div>
        </div>
      )}
    </div>
  )
} 