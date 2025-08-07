"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Profile } from "@/types/profile"

interface UserProfileBadgesProps {
  profile: Profile
}

export function UserProfileBadges({ profile }: UserProfileBadgesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Badges</CardTitle>
      </CardHeader>
      <CardContent>
        {profile.badges && profile.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge) => (
              <Badge key={badge.id} variant="secondary" className="gap-2">
                <span className="text-lg">{badge.icon}</span>
                {badge.name}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No badges earned yet</p>
        )}
      </CardContent>
    </Card>
  )
} 