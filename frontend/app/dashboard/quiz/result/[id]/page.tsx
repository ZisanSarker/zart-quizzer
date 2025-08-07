"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useQuizResultData } from "@/hooks/use-quiz-result-data"
import { QuizResultHeader } from "@/components/quiz/quiz-result-header"
import { QuizResultSummary } from "@/components/quiz/quiz-result-summary"
import { QuizResultReview } from "@/components/quiz/quiz-result-review"
import { QuizResultFooter } from "@/components/quiz/quiz-result-footer"
import Link from "next/link"

export default function QuizResultPage() {
  const params = useParams() as { id: string }
  const { isLoading, result } = useQuizResultData(params.id)

  const handleShareResults = () => {
    navigator.clipboard.writeText(window.location.href)
    // You can add toast notification here if needed
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-2">Result is processing...</h2>
          <p className="text-muted-foreground">Please wait while we load your results</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
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
    )
  }

  return (
    <div className="w-full">
      <QuizResultHeader 
        quiz={result.quizId} 
        onShareResults={handleShareResults} 
      />
      <QuizResultSummary result={result} />
      <QuizResultReview result={result} />
      <QuizResultFooter quiz={result.quizId} />
    </div>
  )
}