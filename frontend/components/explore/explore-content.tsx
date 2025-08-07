"use client"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Section } from "@/components/section"
import { ExploreTabContent } from "./explore-tab-content"
import { ExploreTabsHeader } from "./explore-tabs-header"
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
          <ExploreTabsHeader 
            activeTab={activeTab}
            onTabChange={onTabChange}
            quizCount={pagedQuizzes.length}
          />

          {/* Popular Tab */}
          <TabsContent value="popular" className="space-y-3 sm:space-y-4 md:space-y-6">
            <ExploreTabContent
              isLoading={isLoading}
              pagedQuizzes={pagedQuizzes}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
              onSave={onSave}
              savingQuizId={savingQuizId}
              formatRelativeTime={formatRelativeTime}
            />
          </TabsContent>

          {/* Recent Tab */}
          <TabsContent value="recent" className="space-y-3 sm:space-y-4 md:space-y-6">
            <ExploreTabContent
              isLoading={isLoading}
              pagedQuizzes={pagedQuizzes}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
              onSave={onSave}
              savingQuizId={savingQuizId}
              formatRelativeTime={formatRelativeTime}
            />
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-3 sm:space-y-4 md:space-y-6">
            <ExploreTabContent
              isLoading={isLoading}
              pagedQuizzes={pagedQuizzes}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
              onSave={onSave}
              savingQuizId={savingQuizId}
              formatRelativeTime={formatRelativeTime}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Section>
  )
} 