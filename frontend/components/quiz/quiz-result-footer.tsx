"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { QuizAttemptResult } from "@/types/quiz"

interface QuizResultFooterProps {
  quiz: QuizAttemptResult["quizId"]
}

export function QuizResultFooter({ quiz }: QuizResultFooterProps) {
  return (
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
  )
} 