"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Brain, Clock, Edit, MoreHorizontal, Share2, Trash2, Users } from "lucide-react"
import { StaggerItem } from "@/components/animations/motion"

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
          <CardDescription className="text-sm sm:text-base">
            {type === "created" 
              ? quiz.description 
              : `By ${quiz.author ?? (quiz.createdBy?.name || "Unknown")}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
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
        </CardContent>
      </Card>
    </StaggerItem>
  )
} 