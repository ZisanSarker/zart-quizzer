"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LibraryQuizCardActionsProps {
  quiz: any
  type: "created" | "saved"
}

export function LibraryQuizCardActions({ quiz, type }: LibraryQuizCardActionsProps) {
  return (
    <div className="mt-4 flex gap-2">
      {type === "created" ? (
        <>
          <Button variant="outline" size="sm" className="flex-1 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm" asChild>
            <Link href={`/dashboard/quiz/preview/${quiz._id}`}>Preview</Link>
          </Button>
          <Button size="sm" className="flex-1 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm" asChild>
            <Link href={`/dashboard/quiz/practice/${quiz._id}`}>Practice</Link>
          </Button>
        </>
      ) : (
        <Button className="w-full" asChild>
          <Link href={`/dashboard/quiz/practice/${quiz._id}`}>Practice Quiz</Link>
        </Button>
      )}
    </div>
  )
} 