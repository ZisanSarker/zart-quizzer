"use client"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExploreTabsHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  quizCount: number
}

export function ExploreTabsHeader({ activeTab, onTabChange, quizCount }: ExploreTabsHeaderProps) {
  return (
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
        <div className="responsive-text-small text-muted-foreground">{quizCount} quizzes found</div>
      </div>
    </div>
  )
} 