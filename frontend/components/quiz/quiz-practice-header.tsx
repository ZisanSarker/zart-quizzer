"use client"

import { Button } from "@/components/ui/button"
import { Share2, Star } from "lucide-react"
import type { Quiz } from "@/types/quiz"

interface QuizPracticeHeaderProps {
  quiz: Quiz
  showRateButton: boolean
  hasRated: boolean
  onShareQuiz: () => void
  onRateButtonClick: () => void
}

export function QuizPracticeHeader({ 
  quiz, 
  showRateButton, 
  hasRated, 
  onShareQuiz, 
  onRateButtonClick 
}: QuizPracticeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight gradient-heading">
        Practice: {quiz.topic}
      </h1>
      <div className="flex items-center gap-2">
        {/* Enhanced Rate Quiz Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRateButtonClick}
          className={`
            flex items-center gap-2 transition-all duration-300 transform hover:scale-105 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm
            ${showRateButton 
              ? hasRated
                ? "bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                : "bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 dark:from-amber-950/30 dark:to-yellow-950/30 dark:hover:from-amber-950/50 dark:hover:to-yellow-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 shadow-md hover:shadow-lg rate-button-glow"
              : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-950/30 dark:hover:bg-gray-950/50 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400"
            }
            ${showRateButton && !hasRated ? "rate-button-pulse" : ""}
          `}
          disabled={!showRateButton}
          title={
            !showRateButton 
              ? quiz?.createdBy === "user?._id" 
                ? "You cannot rate your own quiz" 
                : "This quiz is not public"
              : hasRated 
                ? "You have already rated this quiz" 
                : "Rate this public quiz"
          }
        >
          <Star className={`h-4 w-4 transition-all duration-300 ${
            showRateButton && !hasRated ? "star-bounce" : ""
          }`} />
          {showRateButton 
            ? hasRated 
              ? "Rated ✓" 
              : "Rate Quiz"
            : quiz?.createdBy === "user?._id" 
              ? "Your Quiz" 
              : "Private Quiz"
          }
        </Button>
        
        <Button variant="outline" size="sm" onClick={onShareQuiz} className="min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm">
          <Share2 className="mr-2 h-4 w-4" /> Share Quiz
        </Button>
      </div>
    </div>
  )
} 