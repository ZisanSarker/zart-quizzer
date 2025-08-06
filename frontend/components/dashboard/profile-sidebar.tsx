"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import { FadeIn } from "@/components/animations/motion"
import type { Profile } from "@/types/profile"
import type { UserStats } from "@/types/stats"

interface ProfileSidebarProps {
  profileData: Profile
  stats: UserStats
  formData: {
    username: string
    email: string
  }
  isEditMode: boolean
  onUploadPhoto: () => void
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export function ProfileSidebar({ 
  profileData, 
  stats, 
  formData, 
  isEditMode, 
  onUploadPhoto 
}: ProfileSidebarProps) {
  return (
    <FadeIn>
      <Card className="card-hover">
        <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary-100">
              <AvatarImage src={profileData.userIdObj.profilePicture || "/placeholder.svg"} alt={formData.username} />
              <AvatarFallback className="text-xl sm:text-3xl">
                {formData.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isEditMode && (
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-primary text-white hover:bg-primary/90 min-h-[44px] sm:min-h-[40px]"
                onClick={onUploadPhoto}
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
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
        </CardContent>
      </Card>
    </FadeIn>
  )
} 