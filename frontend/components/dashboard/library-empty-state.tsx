"use client"

import Link from "next/link"
import { Brain, Plus } from "lucide-react"
import { GradientButton } from "@/components/ui/gradient-button"
import { FadeIn } from "@/components/animations/motion"

interface LibraryEmptyStateProps {
  type: "created" | "saved"
}

export function LibraryEmptyState({ type }: LibraryEmptyStateProps) {
  return (
    <FadeIn>
      <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {type === "created" ? "No quizzes found" : "No saved quizzes"}
        </h3>
        <p className="text-muted-foreground mb-6">
          {type === "created" 
            ? "You haven't created any quizzes yet"
            : "You haven't saved any quizzes yet"
          }
        </p>
        <GradientButton asChild>
          <Link href={type === "created" ? "/dashboard/create" : "/explore"}>
            {type === "created" ? (
              <>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Quiz
              </>
            ) : (
              "Explore Quizzes"
            )}
          </Link>
        </GradientButton>
      </div>
    </FadeIn>
  )
} 