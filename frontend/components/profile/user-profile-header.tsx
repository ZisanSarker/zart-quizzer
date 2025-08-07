"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, Globe, Calendar } from "lucide-react"
import type { Profile } from "@/types/profile"

interface UserProfileHeaderProps {
  profile: Profile
  isOwnProfile: boolean
}

export function UserProfileHeader({ profile, isOwnProfile }: UserProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
            <AvatarImage 
              src={profile.userIdObj.profilePicture || "/placeholder-user.jpg"} 
              alt={profile.userIdObj.username} 
            />
            <AvatarFallback className="text-lg">
              {profile.userIdObj.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold truncate">
                {profile.userIdObj.username}
              </h1>
              {isOwnProfile && (
                <Badge variant="secondary">You</Badge>
              )}
            </div>
            
            {profile.bio && profile.bio.trim() ? (
              <p className="text-muted-foreground mb-3">{profile.bio}</p>
            ) : (
              <p className="text-muted-foreground mb-3 italic">No bio added yet</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.location && profile.location.trim() ? (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground/60">
                  <MapPin className="h-4 w-4" />
                  <span className="italic">No location set</span>
                </div>
              )}
              {profile.website && profile.website.trim() ? (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Website
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground/60">
                  <Globe className="h-4 w-4" />
                  <span className="italic">No website set</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {new Date(profile.userIdObj.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 