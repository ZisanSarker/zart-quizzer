"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain } from "lucide-react"
import { StaggerChildren, FadeIn } from "@/components/animations/motion"
import { useHistoryData } from "@/hooks/use-history-data"
import { 
  HistoryStatsCards, 
  HistoryItem, 
  HistoryPerformance, 
  HistoryAchievements 
} from "@/components/dashboard"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader, ContentSection } from "@/components/ui/layout"
import { LoadingSpinner, ErrorMessage } from "@/components/ui/feedback"

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
              <StaggerChildren className="space-y-4">
                {quizHistory.map((item) => (
                  <HistoryItem key={item.id} quiz={item} />
                ))}
              </StaggerChildren>
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
            <HistoryPerformance 
              performanceByTopic={performanceByTopic}
              recentProgress={quizHistory.slice(0, 5)}
            />
          </TabsContent>

          <TabsContent value="achievements">
            <HistoryAchievements achievements={achievements} />
          </TabsContent>
        </Tabs>
      </ContentSection>
    </div>
  )
}