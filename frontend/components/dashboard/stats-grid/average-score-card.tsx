"use client"

import { BarChart3 } from "lucide-react"
import { ChartCard } from "../chart-card"
import { StatsLineChart } from "./stats-line-chart"

interface AverageScoreCardProps {
  averageScore: number
  scoreChartData: Array<{
    day: string
    score: number
    target: number
    aboveTarget: boolean
  }>
}

export function AverageScoreCard({ averageScore, scoreChartData }: AverageScoreCardProps) {
  return (
    <ChartCard
      title="Average Score"
      subtitle="Your performance overview"
      icon={BarChart3}
      headerContent={
        <div className="text-right">
          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {averageScore}
            <span className="text-2xl">%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Overall Performance</p>
          <h4 className="text-sm font-semibold text-foreground mt-2">Weekly Performance</h4>
        </div>
      }
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <StatsLineChart scoreChartData={scoreChartData} />
        
        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Below Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Above Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Target (85%)</span>
          </div>
        </div>
      </div>
    </ChartCard>
  )
} 