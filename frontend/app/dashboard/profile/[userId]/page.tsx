"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  User, 
  MapPin, 
  Globe, 
  Twitter, 
  Linkedin, 
  Github, 
  Trophy, 
  Brain, 
  Target, 
  Users,
  Calendar,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { FadeIn } from "@/components/animations/motion"

import type { Profile } from "@/types/profile"
import { getUserProfile } from "@/lib/profile"

export default function UserProfilePage() {
  const { userId } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId && userId !== 'unknown') {
      setIsLoading(true)
      setError(null)
      
      console.log('Fetching profile for userId:', userId)
      
      getUserProfile(userId as string)
        .then((data) => {
          console.log('Profile data received:', data)
          console.log('Profile bio:', data.bio)
          console.log('Profile location:', data.location)
          console.log('Profile website:', data.website)
          setProfile(data)
        })
        .catch((err) => {
          console.error('Failed to fetch user profile:', err)
          console.error('Error details:', err.response?.data || err.message)
          setError('Failed to load profile')
          toast({
            title: "Error",
            description: err.response?.data?.message || "Could not load user profile",
            variant: "destructive"
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setError('Invalid user ID')
      setIsLoading(false)
    }
  }, [userId, toast])

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (error || !profile) {
    return (
      <main className="flex-1 mx-auto py-6 sm:py-8 max-w-4xl">
        <div className="text-center py-12">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The user profile you're looking for doesn't exist."}
          </p>
          <Button asChild>
            <Link href="/dashboard/explore">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Explore
            </Link>
          </Button>
        </div>
      </main>
    )
  }

  const isOwnProfile = user?._id === profile.userId

  return (
    <main className="flex-1 mx-auto py-6 sm:py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/dashboard/explore">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Link>
        </Button>
      </div>

      <FadeIn>
        <div className="space-y-6">
          {/* Profile Header */}
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile.stats.quizzesCreated}</p>
                    <p className="text-sm text-muted-foreground">Quizzes Created</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile.stats.quizzesTaken}</p>
                    <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile.stats.averageScore}%</p>
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile.stats.followers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.socialLinks && 
               (profile.socialLinks.twitter?.trim() || profile.socialLinks.linkedin?.trim() || profile.socialLinks.github?.trim()) ? (
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

          {/* Badges */}
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
        </div>
      </FadeIn>
    </main>
  )
}

function ProfileSkeleton() {
  return (
    <main className="flex-1 mx-auto py-6 sm:py-8 max-w-4xl">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
} 