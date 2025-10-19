"use client"

import { Suspense } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useQuizResultData } from "@/hooks/use-quiz-result-data"
import {
  LazyQuizResultHeader,
  LazyQuizResultSummary,
  LazyQuizResultReview,
  LazyQuizResultFooter,
} from "@/components/lazy-components"
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
      <Suspense fallback={<div className="h-24 bg-muted rounded animate-pulse mb-6" />}>
        <LazyQuizResultHeader 
          quiz={result.quizId} 
          onShareResults={handleShareResults} 
        />
      </Suspense>
      <Suspense fallback={<div className="h-48 bg-muted rounded animate-pulse mb-6" />}>
        <LazyQuizResultSummary result={result} />
      </Suspense>
      <Suspense fallback={<div className="space-y-4">
        {[1, 2, 3].map(i => (<div key={i} className="h-32 bg-muted rounded animate-pulse" />))}
      </div>}>
        <LazyQuizResultReview result={result} />
      </Suspense>
      <Suspense fallback={<div className="h-16 bg-muted rounded animate-pulse mt-6" />}>
        <LazyQuizResultFooter quiz={result.quizId} />
      </Suspense>
    </div>
  )
}