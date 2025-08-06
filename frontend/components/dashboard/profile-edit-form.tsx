"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Check, Loader2, Mail, User } from "lucide-react"
import { FadeUp } from "@/components/animations/motion"

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
  const handleSave = async () => {
    const success = await onSave()
    if (success) {
      onCancel()
    }
  }

  return (
    <FadeUp>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={onCancel} className="mr-2">
            Cancel
          </Button>
          <GradientButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </GradientButton>
        </CardFooter>
      </Card>
    </FadeUp>
  )
} 