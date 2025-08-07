"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { FadeIn } from "@/components/animations/motion"
import { 
  UserProfileHeader, 
  UserProfileStats, 
  UserProfileSocialLinks, 
  UserProfileBadges, 
  UserProfileSkeleton 
} from "@/components/profile"

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
    return <UserProfileSkeleton />
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
          <UserProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
          <UserProfileStats profile={profile} />
          <UserProfileSocialLinks profile={profile} />
          <UserProfileBadges profile={profile} />
        </div>
      </FadeIn>
    </main>
  )
} 