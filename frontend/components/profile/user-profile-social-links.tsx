"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Twitter, Linkedin, Github } from "lucide-react"
import type { Profile } from "@/types/profile"

interface UserProfileSocialLinksProps {
  profile: Profile
}

export function UserProfileSocialLinks({ profile }: UserProfileSocialLinksProps) {
  const hasSocialLinks = profile.socialLinks && 
    (profile.socialLinks.twitter?.trim() || profile.socialLinks.linkedin?.trim() || profile.socialLinks.github?.trim())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent>
        {hasSocialLinks ? (
          <div className="flex gap-4">
            {profile.socialLinks.twitter && profile.socialLinks.twitter.trim() && (
              <a 
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {profile.socialLinks.linkedin && profile.socialLinks.linkedin.trim() && (
              <a 
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {profile.socialLinks.github && profile.socialLinks.github.trim() && (
              <a 
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No social links added yet</p>
        )}
      </CardContent>
    </Card>
  )
} 