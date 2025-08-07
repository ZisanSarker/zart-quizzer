"use client"

import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"

interface QuizPracticeActionsProps {
  practiceSubmitted: boolean
  onResetPractice: () => void
  onFinishPractice: () => void
}

export function QuizPracticeActions({ 
  practiceSubmitted, 
  onResetPractice, 
  onFinishPractice 
}: QuizPracticeActionsProps) {
  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto mt-8 sm:mt-12 mb-6 gap-3">
      <div className="flex flex-col sm:flex-row justify-end w-full gap-3">
        <GradientButton onClick={onResetPractice} className="min-h-[44px] sm:min-h-[40px] text-sm sm:text-base">
          Reset Practice
        </GradientButton>
        <Button
          variant="default"
          onClick={onFinishPractice}
          disabled={practiceSubmitted}
          className="min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
        >
          {practiceSubmitted ? "Practice Saved" : "Finish Practice"}
        </Button>
      </div>
    </div>
  )
} 