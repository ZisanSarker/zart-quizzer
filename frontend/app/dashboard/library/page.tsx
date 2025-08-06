"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { StaggerChildren } from "@/components/animations/motion"
import { GradientButton } from "@/components/ui/gradient-button"
import { Section } from "@/components/section"
import { useLibraryData } from "@/hooks/use-library-data"
import { LibraryQuizCard, LibrarySkeleton, LibraryEmptyState } from "@/components/dashboard"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function LibraryPage() {
  const {
    isLoading,
    createdQuizzes,
    savedQuizzes,
    unsavingQuizId,
    handleShareQuiz,
    handleRemoveSavedQuiz
  } = useLibraryData()

  return (
    <div className="w-full flex flex-col items-center">
      {/* Library Header Section */}
      <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="animate-fade-up">
              <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
                My Library
              </h1>
            </div>
            <div className="animate-fade-up animate-delay-200">
              <GradientButton asChild className="w-full sm:w-auto touch-target">
                <Link href="/dashboard/create">
                  <Plus className="mr-2 h-4 w-4" /> Create Quiz
                </Link>
              </GradientButton>
            </div>
          </div>
        </div>
      </Section>

      {/* Quizzes Content Section */}
      <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <Tabs defaultValue="created">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4 sm:mb-6">
              <TabsTrigger value="created" className="text-sm sm:text-base">Created by Me</TabsTrigger>
              <TabsTrigger value="saved" className="text-sm sm:text-base">Saved</TabsTrigger>
            </TabsList>

            <TabsContent value="created">
              {isLoading ? (
                <LibrarySkeleton count={3} />
              ) : createdQuizzes.length > 0 ? (
                <StaggerChildren className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {createdQuizzes.map((quiz) => (
                    <LibraryQuizCard
                      key={quiz._id}
                      quiz={quiz}
                      type="created"
                      onShare={handleShareQuiz}
                    />
                  ))}
                </StaggerChildren>
              ) : (
                <LibraryEmptyState type="created" />
              )}
            </TabsContent>

            <TabsContent value="saved">
              {isLoading ? (
                <LibrarySkeleton count={3} />
              ) : savedQuizzes.length > 0 ? (
                <StaggerChildren className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {savedQuizzes.map((quiz) => (
                    <LibraryQuizCard
                      key={quiz._id}
                      quiz={quiz}
                      type="saved"
                      onShare={handleShareQuiz}
                      onRemove={handleRemoveSavedQuiz}
                      isRemoving={unsavingQuizId === quiz._id}
                    />
                  ))}
                </StaggerChildren>
              ) : (
                <LibraryEmptyState type="saved" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={false} onOpenChange={(open) => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {}} // Removed handleDeleteQuiz
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}