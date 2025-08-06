"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScaleIn } from "@/components/animations/motion"
import type { UserStats } from "@/types/stats"

interface ProfileStatsProps {
  stats: UserStats
}

function getQuizLevel(points: number) {
  if (points >= 50) return { text: "🌟 Ultimate Genius" }
  if (points >= 45) return { text: "👑 Quiz Virtuoso" }
  if (points >= 40) return { text: "💡 Insight Master" }
  if (points >= 35) return { text: "🦉 Smart Strategist" }
  if (points >= 30) return { text: "🚀 Knowledge Seeker" }
  if (points >= 25) return { text: "🧩 Problem Solver" }
  if (points >= 20) return { text: "🧠 Sharp Thinker" }
  if (points >= 15) return { text: "🎯 Focused Challenger" }
  if (points >= 10) return { text: "📘 Learning Apprentice" }
  if (points >= 5) return { text: "🔍 Curious Explorer" }
  return { text: "🐣 Quiz Newbie" }
}

function getHighestStarBadge(badges: UserStats["badges"]): UserStats["badges"][number] | null {
  if (!badges || badges.length === 0) return null
  const starBadges = badges.filter(b => b.id.startsWith("star"))
  if (starBadges.length === 0) return null
  return starBadges.reduce((prev, curr) => (
    parseInt(curr.id.replace("star", "")) > parseInt(prev.id.replace("star", "")) ? curr : prev
  ))
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const level = getQuizLevel(stats.points)

  return (
    <ScaleIn>
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Your performance and activity on</CardTitle>
          <CardDescription>
            <span
              className={`font-extrabold text-xl animate-pulse text-primary-500`}
              style={{
                display: "inline-block",
              }}
            >
              {level.text}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Points & Badges</h3>
              <div className="flex gap-4 items-center">
                <span className="font-bold text-lg">Points: {stats.points}</span>
                <span className="text-muted-foreground">{stats.timeSpent} spent</span>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {(() => {
                  const badge = getHighestStarBadge(stats.badges)
                  return badge ? (
                    <div
                      key={badge.id}
                      className="flex items-center px-2 py-1 bg-muted rounded-lg hover:bg-primary-300 transition-colors cursor-pointer"
                      title={badge.description}
                      style={{ minWidth: 56 }}
                    >
                      <span className="text-xl mr-2">{badge.icon}</span>
                      <span className="text-xs font-medium">{badge.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No badges yet</span>
                  )
                })()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ScaleIn>
  )
} 