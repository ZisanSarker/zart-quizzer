"use client"

import type { UserStats } from "@/types/stats"

interface ProfileBadgesProps {
  stats: UserStats
}

function getHighestStarBadge(badges: UserStats["badges"]): UserStats["badges"][number] | null {
  if (!badges || badges.length === 0) return null
  const starBadges = badges.filter(b => b.id.startsWith("star"))
  if (starBadges.length === 0) return null
  return starBadges.reduce((prev, curr) => (
    parseInt(curr.id.replace("star", "")) > parseInt(prev.id.replace("star", "")) ? curr : prev
  ))
}

export function ProfileBadges({ stats }: ProfileBadgesProps) {
  return (
    <div className="w-full mt-4 sm:mt-6">
      <h3 className="font-medium mb-3 text-sm sm:text-base">Badges</h3>
      <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
        {(() => {
          const badge = getHighestStarBadge(stats.badges)
          return badge ? (
            <div
              key={badge.id}
              className="flex flex-col items-center p-2 bg-muted rounded-lg transition-colors cursor-pointer animate-bounce-small"
              title={badge.description}
              style={{ minWidth: 56 }}
            >
              <span className="text-[15px] mb-1">{badge.icon}</span>
              <span className="text-[10px] font-medium">{badge.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs sm:text-sm">No badges yet</span>
          )
        })()}
      </div>
    </div>
  )
} 