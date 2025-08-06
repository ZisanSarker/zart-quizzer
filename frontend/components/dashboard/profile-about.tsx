"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScaleIn } from "@/components/animations/motion"
import type { Profile } from "@/types/profile"

interface ProfileAboutProps {
  profileData: Profile
}

export function ProfileAbout({ profileData }: ProfileAboutProps) {
  return (
    <ScaleIn>
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Bio</h3>
            <p className="text-muted-foreground">{profileData.bio || "No bio provided"}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <h3 className="font-medium mb-2">Location</h3>
              <p className="text-muted-foreground">{profileData.location || "Not specified"}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Website</h3>
              {profileData.website ? (
                <a
                  href={profileData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profileData.website}
                </a>
              ) : (
                <p className="text-muted-foreground">Not specified</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Social Links</h3>
            <div className="flex flex-wrap gap-3">
              {profileData.socialLinks?.twitter && (
                <a
                  href={`https://twitter.com/${profileData.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-muted rounded-full text-sm hover:outline hover:text-primary-500 transition-colors"
                >
                  Twitter
                </a>
              )}
              {profileData.socialLinks?.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profileData.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-muted rounded-full text-sm hover:outline hover:text-primary-500 transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {profileData.socialLinks?.github && (
                <a
                  href={`https://github.com/${profileData.socialLinks.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-muted rounded-full text-sm hover:outline hover:text-primary-500 transition-colors"
                >
                  GitHub
                </a>
              )}
              {!profileData.socialLinks?.twitter &&
                !profileData.socialLinks?.linkedin &&
                !profileData.socialLinks?.github && (
                  <p className="text-muted-foreground">No social links provided</p>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ScaleIn>
  )
} 