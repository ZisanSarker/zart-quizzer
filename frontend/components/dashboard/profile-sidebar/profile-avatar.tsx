"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface ProfileAvatarProps {
  profileData: any
  formData: {
    username: string
  }
  isEditMode: boolean
  onUploadPhoto: () => void
}

export function ProfileAvatar({ profileData, formData, isEditMode, onUploadPhoto }: ProfileAvatarProps) {
  return (
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
  )
} 