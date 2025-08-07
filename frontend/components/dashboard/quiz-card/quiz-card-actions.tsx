"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface QuizCardActionsProps {
  date?: string
  status: "completed" | "recommended" | "created"
  actionText?: string
  actionHref: string
}

export function QuizCardActions({ date, status, actionText, actionHref }: QuizCardActionsProps) {
  return (
    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground truncate">
          {date || (status === "recommended" ? "Recommended for you" : "")}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="group-hover:border-primary/50 group-hover:text-primary transition-colors duration-300"
        >
          <Link href={actionHref}>
            <ArrowRight className="h-3 w-3 mr-1" />
            {actionText || "View"}
          </Link>
        </Button>
      </div>
    </div>
  )
} 