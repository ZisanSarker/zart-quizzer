"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Brain } from "lucide-react"
import { useHistoryData } from "@/hooks/use-history-data"
import { 
  HistoryStatsCards, 
} from "@/components/dashboard"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader, ContentSection } from "@/components/ui/layout"
import { LoadingSpinner, ErrorMessage } from "@/components/ui/feedback"
import { LazyHistoryItem, LazyHistoryPerformance, LazyHistoryAchievements } from "@/components/lazy-components"

// Lazy load Tabs components
const Tabs = dynamic(() => import('@/components/ui/tabs').then(mod => mod.Tabs))
const TabsContent = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsContent))
const TabsList = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsList))
const TabsTrigger = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsTrigger))

const StaggerChildren = dynamic(() => import('@/components/animations/motion').then(mod => mod.StaggerChildren), {
  ssr: false,
})

const FadeIn = dynamic(() => import('@/components/animations/motion').then(mod => mod.FadeIn), {
  ssr: false,
})

export default function HistoryPage() {
  const {
    isLoading,
    quizHistory,
    error,
    performanceByTopic,
    achievements
  } = useHistoryData()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* History Header Section */}
      <PageHeader title="Quiz History" />

      {/* Stats Section */}
      <ContentSection>
        <HistoryStatsCards 
          quizHistory={quizHistory} 
          performanceByTopic={performanceByTopic} 
        />
      </ContentSection>

      {/* Content Section */}
      <ContentSection>
        <Tabs defaultValue="history">
          <TabsList className="grid w-full max-w-full sm:max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="history">Quiz History</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            {quizHistory.length > 0 ? (
              <Suspense fallback={<div className="space-y-4">
                {[1, 2, 3].map(i => (<div key={i} className="h-24 bg-muted rounded animate-pulse" />))}
              </div>}>
                <StaggerChildren className="space-y-4">
                  {quizHistory.map((item) => (
                    <LazyHistoryItem key={item.id} quiz={item} />
                  ))}
                </StaggerChildren>
              </Suspense>
            ) : (
              <FadeIn>
                <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No quiz history found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't taken any quizzes yet
                  </p>
                </div>
              </FadeIn>
            )}
          </TabsContent>

          <TabsContent value="performance">
            <Suspense fallback={<div className="h-96 bg-muted rounded animate-pulse" />}>
              <LazyHistoryPerformance 
                performanceByTopic={performanceByTopic}
                recentProgress={quizHistory.slice(0, 5)}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="achievements">
            <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (<div key={i} className="h-32 bg-muted rounded animate-pulse" />))}
            </div>}>
              <LazyHistoryAchievements achievements={achievements} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </ContentSection>
    </div>
  )
}