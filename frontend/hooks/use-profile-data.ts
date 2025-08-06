"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { getProfile, updateProfile, UpdateProfilePayload } from "@/lib/profile"
import { getMyStats } from "@/lib/stats"
import type { Profile } from "@/types/profile"
import type { UserStats } from "@/types/stats"

export function useProfileData() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<Profile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [formData, setFormData] = useState<{
    username: string
    email: string
    bio: string
    location: string
    website: string
    twitter: string
    linkedin: string
    github: string
  }>({
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    twitter: "",
    linkedin: "",
    github: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ profile }, userStats] = await Promise.all([getProfile(), getMyStats()])
        setProfileData(profile)
        setStats(userStats)
        setFormData({
          username: profile.userIdObj.username,
          email: profile.userIdObj.email,
          bio: profile.bio || "",
          location: profile.location || "",
          website: profile.website || "",
          twitter: profile.socialLinks?.twitter || "",
          linkedin: profile.socialLinks?.linkedin || "",
          github: profile.socialLinks?.github || "",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile/statistics data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [toast, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const updatePayload: UpdateProfilePayload = {
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        socialLinks: {
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          github: formData.github,
        },
      }
      const { profile } = await updateProfile(updatePayload)
      setProfileData(profile)
      setFormData({
        username: profile.userIdObj.username,
        email: profile.userIdObj.email,
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        twitter: profile.socialLinks?.twitter || "",
        linkedin: profile.socialLinks?.linkedin || "",
        github: profile.socialLinks?.github || "",
      })
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
      return true
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      })
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleUploadPhoto = () => {
    toast({
      title: "Feature coming soon",
      description: "Profile photo upload will be available soon",
    })
  }

  return {
    isLoading,
    isSaving,
    profileData,
    stats,
    formData,
    handleInputChange,
    handleSaveProfile,
    handleUploadPhoto
  }
} 