"use client"

import { CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Share2, Trash2, Users } from "lucide-react"
import Link from "next/link"

interface LibraryQuizCardHeaderProps {
  quiz: any
  type: "created" | "saved"
  onShare?: (quizId: string) => void
  onRemove?: (quizId: string) => void
  isRemoving?: boolean
}

export function LibraryQuizCardHeader({ 
  quiz, 
  type, 
  onShare, 
  onRemove, 
  isRemoving = false 
}: LibraryQuizCardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <CardTitle className="text-base sm:text-lg">{quiz.topic}</CardTitle>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="min-h-[44px] sm:min-h-[40px]">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {type === "created" ? (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/quiz/edit/${quiz._id}`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare?.(quiz._id)}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {}} // Removed handleToggleVisibility
              >
                <Users className="mr-2 h-4 w-4" />
                Make {quiz.isPublic ? "Private" : "Public"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {}} // Removed handleDeleteQuiz
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => onShare?.(quiz._id)}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onRemove?.(quiz._id)}
                disabled={isRemoving}
              >
                <Trash2 className="mr-2 h-4 w-4" /> 
                {isRemoving ? "Removing..." : "Remove"}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 