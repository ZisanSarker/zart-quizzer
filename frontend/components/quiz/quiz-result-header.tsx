"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { ArrowLeft, ArrowRight, Share2 } from "lucide-react"
import type { QuizAttemptResult } from "@/types/quiz"

interface QuizResultHeaderProps {
  quiz: QuizAttemptResult["quizId"]
  onShareResults: () => void
}

export function QuizResultHeader({ quiz, onShareResults }: QuizResultHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <Link href="/dashboard/history" className="flex items-center text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back to History</span>
      </Link>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onShareResults}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Results
        </Button>
        <GradientButton size="sm" asChild>
          <Link href={`/dashboard/quiz/practice/${quiz._id}`}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Retake Quiz
          </Link>
        </GradientButton>
      </div>
    </div>
  )
} 