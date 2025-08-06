"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  date: string
}

interface HistoryAchievementsProps {
  achievements: Achievement[]
}

export function HistoryAchievements({ achievements }: HistoryAchievementsProps) {
  return (
    <div className="min-h-[300px] grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {achievements.length === 0 ? (
        <Card className="flex flex-1 items-center justify-center">
          <CardContent className="p-6 flex flex-col items-center text-center w-full">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">
              No Achievements Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Complete more quizzes to unlock achievements!
            </p>
          </CardContent>
        </Card>
      ) : (
        achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className="card-hover flex flex-col h-full"
          >
            <CardContent className="p-6 flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {achievement.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {achievement.description}
              </p>
              <Badge variant="outline" className="mt-auto">
                {new Date(achievement.date).toLocaleDateString()}
              </Badge>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
} 