"use client"

import { CheckCircle } from "lucide-react"
import { StaggerItem } from "@/components/animations/motion"
import { StatsPieChart } from "./stats-pie-chart"

interface CompletedQuizzesCardProps {
  completedQuizzes: number
  attemptedQuizzes: number
}

export function CompletedQuizzesCard({ completedQuizzes, attemptedQuizzes }: CompletedQuizzesCardProps) {
  return (
    <StaggerItem>
      <div className="group relative h-full">
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 group-hover:border-primary/30 transition-all duration-500"></div>
        
        {/* Animated border gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
        
        {/* Main card content */}
        <div className="relative px-6 pt-8 pb-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
          {/* Header with Icon and Title - Top Center */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full border border-primary/20 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110">
                  <CheckCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-base font-semibold text-foreground">Quizzes Completed</h3>
                <p className="text-xs text-muted-foreground">Your completion overview</p>
              </div>
            </div>
          </div>

          {/* Stats and Chart Section */}
          <div className="flex items-start justify-center pt-2 flex-1">
            <div className="flex-1">
              {/* Stats Section */}
              <div className="space-y-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {completedQuizzes}
                  </div>
                  <p className="text-xl text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">
                    {attemptedQuizzes}
                  </div>
                  <p className="text-xs text-muted-foreground">Attempted</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">
                    {attemptedQuizzes > 0 ? Math.round((completedQuizzes / attemptedQuizzes) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </div>
            
            {/* Chart Section */}
            <div className="flex-1 flex items-start justify-center">
              <StatsPieChart 
                completedQuizzes={completedQuizzes}
                attemptedQuizzes={attemptedQuizzes}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center mt-1">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 shadow-lg shadow-purple-500/50 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-200 shadow-lg shadow-purple-200/50 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Attempted</span>
              </div>
            </div>
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
      </div>
    </StaggerItem>
  )
} 