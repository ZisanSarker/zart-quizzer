"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProfileSocialLinksProps {
  formData: {
    twitter: string
    linkedin: string
    github: string
  }
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function ProfileSocialLinks({ formData, onInputChange }: ProfileSocialLinksProps) {
  return (
    <div>
      <h3 className="font-medium mb-3">Social Links</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
              @
            </span>
            <Input
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={onInputChange}
              className="rounded-l-none transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
              in/
            </span>
            <Input
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={onInputChange}
              className="rounded-l-none transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
              @
            </span>
            <Input
              id="github"
              name="github"
              value={formData.github}
              onChange={onInputChange}
              className="rounded-l-none transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 