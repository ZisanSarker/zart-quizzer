"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface QuizLoadingProps {
  message?: string
  showBackButton?: boolean
}

export function QuizLoading({ 
  message = "Loading quiz...", 
  showBackButton = false 
}: QuizLoadingProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse text-center">
        <h2 className="text-2xl font-bold mb-2">{message}</h2>
        <p className="text-muted-foreground">
          Please wait while we prepare your quiz
        </p>
        {showBackButton && (
          <Button 
            onClick={() => router.push("/dashboard")} 
            className="mt-4"
          >
            Back to Dashboard
          </Button>
        )}
      </div>
    </div>
  )
} 