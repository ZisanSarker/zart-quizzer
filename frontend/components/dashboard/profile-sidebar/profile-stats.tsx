"use client"

import type { UserStats } from "@/types/stats"

interface ProfileStatsProps {
  stats: UserStats
  profileData: any
  formData: {
    username: string
    email: string
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export function ProfileStats({ stats, profileData, formData }: ProfileStatsProps) {
  return (
    <>
      <h2 className="text-xl sm:text-2xl font-bold">{formData.username}</h2>
      <p className="text-muted-foreground mt-1 text-sm sm:text-base">{formData.email}</p>
      <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm">
        <span>Member since</span>
        <span className="font-medium">{formatDate(profileData.userIdObj.createdAt)}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-4 sm:mt-6">
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl font-bold">{stats.quizzesCreated}</span>
          <span className="text-xs text-muted-foreground">Created</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl font-bold">{stats.quizzesCompleted}</span>
          <span className="text-xs text-muted-foreground">Taken</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl font-bold">{stats.averageScore}%</span>
          <span className="text-xs text-muted-foreground">Avg. Score</span>
        </div>
      </div>
    </>
  )
} 