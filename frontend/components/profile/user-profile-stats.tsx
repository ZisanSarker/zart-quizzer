"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Brain, Target, Trophy, Users } from "lucide-react"
import type { Profile } from "@/types/profile"

interface UserProfileStatsProps {
  profile: Profile
}

export function UserProfileStats({ profile }: UserProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.stats.quizzesCreated}</p>
              <p className="text-sm text-muted-foreground">Quizzes Created</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.stats.quizzesTaken}</p>
              <p className="text-sm text-muted-foreground">Quizzes Taken</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.stats.averageScore}%</p>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.stats.followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 