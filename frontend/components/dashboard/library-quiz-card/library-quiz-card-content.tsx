"use client"

import { CardDescription } from "@/components/ui/card"
import { Brain, Clock, Users } from "lucide-react"

interface LibraryQuizCardContentProps {
  quiz: any
  type: "created" | "saved"
}

export function LibraryQuizCardContent({ quiz, type }: LibraryQuizCardContentProps) {
  return (
    <>
      <CardDescription className="text-sm sm:text-base">
        {type === "created" 
          ? quiz.description 
          : `By ${quiz.author ?? (quiz.createdBy?.name || "Unknown")}`
        }
      </CardDescription>
      
      <div className="flex justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-1">
          <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <span>{quiz.questions?.length || 0} questions</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <span>
            {type === "created" 
              ? (quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : "")
              : `Saved ${quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : ""}`
            }
          </span>
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs sm:text-sm">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <span>{quiz.attempts ?? 0} attempts</span>
        </div>
        <div>
          {type === "created" ? (
            quiz.isPublic ? (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Public</span>
            ) : (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">Private</span>
            )
          ) : (
            <span className="text-xs bg-muted px-2 py-1 rounded-full capitalize">{quiz.difficulty}</span>
          )}
        </div>
      </div>
    </>
  )
} 