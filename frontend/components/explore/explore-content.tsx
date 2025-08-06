"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Section } from "@/components/section"
import { ExploreQuizCard } from "./explore-quiz-card"
import { ExploreSkeleton } from "./explore-skeleton"
import { ExploreEmptyState } from "./explore-empty-state"
import { ExplorePagination } from "./explore-pagination"
import type { ExploreQuiz } from "@/types/quiz"

interface ExploreContentProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isLoading: boolean
  pagedQuizzes: ExploreQuiz[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  onSave: (id: string) => void
  savingQuizId: string | null
  formatRelativeTime: (date: string) => string
}

export function ExploreContent({
  activeTab,
  onTabChange,
  isLoading,
  pagedQuizzes,
  totalPages,
  currentPage,
  onPageChange,
  onSave,
  savingQuizId,
  formatRelativeTime
}: ExploreContentProps) {
  return (
    <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4 md:px-6 lg:px-8">
              <TabsList className="w-full sm:w-auto glass-effect-tabs">
                <TabsTrigger 
                  value="popular" 
                  className="touch-target glass-tab-trigger text-xs sm:text-sm"
                >
                  Popular
                </TabsTrigger>
                <TabsTrigger 
                  value="recent" 
                  className="touch-target glass-tab-trigger text-xs sm:text-sm"
                >
                  Recent
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  className="touch-target glass-tab-trigger text-xs sm:text-sm"
                >
                  Trending
                </TabsTrigger>
              </TabsList>
              <div className="responsive-text-small text-muted-foreground">{pagedQuizzes.length} quizzes found</div>
            </div>
          </div>

          {/* Popular Tab */}
          <TabsContent value="popular" className="space-y-3 sm:space-y-4 md:space-y-6">
            {isLoading ? (
              <ExploreSkeleton />
            ) : pagedQuizzes.length > 0 ? (
              <>
                {pagedQuizzes.map((quiz) => (
                  <ExploreQuizCard
                    key={quiz._id}
                    quiz={quiz}
                    onSave={onSave}
                    saving={savingQuizId === quiz._id}
                    formatRelativeTime={formatRelativeTime}
                  />
                ))}
                <ExplorePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </>
            ) : (
              <ExploreEmptyState />
            )}
          </TabsContent>

          {/* Recent Tab */}
          <TabsContent value="recent" className="space-y-3 sm:space-y-4 md:space-y-6">
            {isLoading ? (
              <ExploreSkeleton />
            ) : pagedQuizzes.length > 0 ? (
              <>
                {pagedQuizzes.map((quiz) => (
                  <ExploreQuizCard
                    key={quiz._id}
                    quiz={quiz}
                    onSave={onSave}
                    saving={savingQuizId === quiz._id}
                    formatRelativeTime={formatRelativeTime}
                  />
                ))}
                <ExplorePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </>
            ) : (
              <ExploreEmptyState />
            )}
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-3 sm:space-y-4 md:space-y-6">
            {isLoading ? (
              <ExploreSkeleton />
            ) : pagedQuizzes.length > 0 ? (
              <>
                {pagedQuizzes.map((quiz) => (
                  <ExploreQuizCard
                    key={quiz._id}
                    quiz={quiz}
                    onSave={onSave}
                    saving={savingQuizId === quiz._id}
                    formatRelativeTime={formatRelativeTime}
                  />
                ))}
                <ExplorePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </>
            ) : (
              <ExploreEmptyState />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Section>
  )
} 