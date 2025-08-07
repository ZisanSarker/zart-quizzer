"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "@/components/animations/motion"
import { ProfileAvatar } from "./profile-avatar"
import { ProfileStats } from "./profile-stats"
import { ProfileBadges } from "./profile-badges"
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
          <ProfileAvatar 
            profileData={profileData}
            formData={formData}
            isEditMode={isEditMode}
            onUploadPhoto={onUploadPhoto}
          />
          <ProfileStats 
            stats={stats}
            profileData={profileData}
            formData={formData}
          />
          <ProfileBadges stats={stats} />
        </CardContent>
      </Card>
    </FadeIn>
  )
} 