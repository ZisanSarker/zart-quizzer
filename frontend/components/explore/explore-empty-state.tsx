"use client"

import { Brain } from "lucide-react"
import { FadeIn } from "@/components/animations/motion"

export function ExploreEmptyState() {
  return (
    <FadeIn>
      <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed mobile-card">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="responsive-heading-3 mb-2">No quizzes found</h3>
        <p className="responsive-text text-muted-foreground mb-6">No quizzes available in this category</p>
      </div>
    </FadeIn>
  )
} 