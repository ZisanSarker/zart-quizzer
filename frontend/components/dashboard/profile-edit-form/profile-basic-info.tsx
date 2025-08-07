"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, User } from "lucide-react"

interface ProfileBasicInfoProps {
  formData: {
    username: string
    email: string
    bio: string
    location: string
    website: string
  }
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function ProfileBasicInfo({ formData, onInputChange }: ProfileBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">
            <User className="h-4 w-4 inline mr-2" />
            Username
          </Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={onInputChange}
            className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            <Mail className="h-4 w-4 inline mr-2" />
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            disabled
            className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 bg-muted cursor-not-allowed"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Input
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={onInputChange}
          className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={onInputChange}
            className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={onInputChange}
            className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
          />
        </div>
      </div>
    </div>
  )
} 