"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StaggerItem } from "@/components/animations/motion"
import { LibraryQuizCardHeader } from "./library-quiz-card-header"
import { LibraryQuizCardContent } from "./library-quiz-card-content"
import { LibraryQuizCardActions } from "./library-quiz-card-actions"

interface LibraryQuizCardProps {
  quiz: any
  type: "created" | "saved"
  onShare?: (quizId: string) => void
  onRemove?: (quizId: string) => void
  isRemoving?: boolean
}

export function LibraryQuizCard({ 
  quiz, 
  type, 
  onShare, 
  onRemove, 
  isRemoving = false 
}: LibraryQuizCardProps) {
  return (
    <StaggerItem>
      <Card className="card-hover">
        <CardHeader className="pb-3 p-3 sm:p-4 md:p-6">
          <LibraryQuizCardHeader 
            quiz={quiz}
            type={type}
            onShare={onShare}
            onRemove={onRemove}
            isRemoving={isRemoving}
          />
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <LibraryQuizCardContent quiz={quiz} type={type} />
          <LibraryQuizCardActions quiz={quiz} type={type} />
        </CardContent>
      </Card>
    </StaggerItem>
  )
} 