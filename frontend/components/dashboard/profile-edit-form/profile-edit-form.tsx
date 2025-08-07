"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeUp } from "@/components/animations/motion"
import { ProfileBasicInfo } from "./profile-basic-info"
import { ProfileSocialLinks } from "./profile-social-links"
import { ProfileFormActions } from "./profile-form-actions"

interface ProfileEditFormProps {
  formData: {
    username: string
    email: string
    bio: string
    location: string
    website: string
    twitter: string
    linkedin: string
    github: string
  }
  isSaving: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSave: () => Promise<boolean>
  onCancel: () => void
}

export function ProfileEditForm({ 
  formData, 
  isSaving, 
  onInputChange, 
  onSave, 
  onCancel 
}: ProfileEditFormProps) {
  return (
    <FadeUp>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileBasicInfo formData={formData} onInputChange={onInputChange} />
          <ProfileSocialLinks formData={formData} onInputChange={onInputChange} />
        </CardContent>
        <CardFooter>
          <ProfileFormActions 
            isSaving={isSaving}
            onSave={onSave}
            onCancel={onCancel}
          />
        </CardFooter>
      </Card>
    </FadeUp>
  )
} 