"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface QuizHeaderProps {
  title: string
  isCompleted?: boolean
  onShare?: () => void
}

export function QuizHeader({ title, isCompleted = false, onShare }: QuizHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold tracking-tight gradient-heading">
        {isCompleted ? "Quiz Results is Loading" : title}
      </h1>
      {!isCompleted && onShare && (
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="mr-2 h-4 w-4" /> Share Quiz
        </Button>
      )}
    </div>
  )
} 