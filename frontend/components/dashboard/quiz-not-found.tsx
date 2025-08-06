"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function QuizNotFound() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Quiz not found</h2>
        <p className="text-muted-foreground mb-4">
          The quiz you're looking for doesn't exist or has been removed
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
} 