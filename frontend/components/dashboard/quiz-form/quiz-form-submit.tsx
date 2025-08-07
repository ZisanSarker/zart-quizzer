"use client"

import { GradientButton } from "@/components/ui/gradient-button"
import { Loader2, Sparkles } from "lucide-react"

interface QuizFormSubmitProps {
  onSubmit: () => void
  isGenerating: boolean
  isDisabled: boolean
}

export function QuizFormSubmit({ onSubmit, isGenerating, isDisabled }: QuizFormSubmitProps) {
  return (
    <GradientButton
      className="w-full gap-2 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
      onClick={onSubmit}
      disabled={isDisabled || isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating Quiz...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate Quiz
        </>
      )}
    </GradientButton>
  )
} 