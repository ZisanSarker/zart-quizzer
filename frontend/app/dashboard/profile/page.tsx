"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Check, Loader2, Lock, Mail, User } from "lucide-react"
import { FadeIn, FadeUp, ScaleIn } from "@/components/animations/motion"
import { useAuth } from "@/contexts/auth-context"
import { getProfile, updateProfile, UpdateProfilePayload } from "@/lib/profile"
import { getMyStats } from "@/lib/stats"
import type { Profile } from "@/types/profile"
import type { UserStats } from "@/types/stats"

function getQuizLevel(points: number) {
  if (points >= 50) return { text: "🌟 Ultimate Genius" }
  if (points >= 45) return { text: "👑 Quiz Virtuoso" }
  if (points >= 40) return { text: "💡 Insight Master" }
  if (points >= 35) return { text: "🦉 Smart Strategist" }
  if (points >= 30) return { text: "🚀 Knowledge Seeker" }
  if (points >= 25) return { text: "🧩 Problem Solver" }
  if (points >= 20) return { text: "🧠 Sharp Thinker" }
  if (points >= 15) return { text: "🎯 Focused Challenger" }
  if (points >= 10) return { text: "📘 Learning Apprentice" }
  if (points >= 5) return { text: "🔍 Curious Explorer" }
  return { text: "🐣 Quiz Newbie" }
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [tab, setTab] = useState<"about" | "stats" | "edit">("about")
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
      setTab("about")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      })
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  function getHighestStarBadge(badges: UserStats["badges"]): UserStats["badges"][number] | null {
    if (!badges || badges.length === 0) return null
    const starBadges = badges.filter(b => b.id.startsWith("star"))
    if (starBadges.length === 0) return null
    return starBadges.reduce((prev, curr) => (
      parseInt(curr.id.replace("star", "")) > parseInt(prev.id.replace("star", "")) ? curr : prev
    ))
  }

  if (isLoading || !profileData || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-2">Loading profile...</h2>
          <p className="text-muted-foreground">Please wait while we load your profile data</p>
        </div>
      </div>
    )
  }

  const level = getQuizLevel(stats.points)

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight gradient-heading">My Profile</h1>
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 lg:grid-cols-[1fr_2fr]">
        <FadeIn>
          <Card className="card-hover">
            <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary-100">
                  <AvatarImage src={profileData.userIdObj.profilePicture || "/placeholder-user.jpg"} alt={formData.username} />
                  <AvatarFallback className="text-xl sm:text-3xl">
                    {formData.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {tab === "edit" && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-primary text-white hover:bg-primary/90 min-h-[44px] sm:min-h-[40px]"
                    onClick={handleUploadPhoto}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">{formData.username}</h2>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">{formData.email}</p>
              <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm">
                <span>Member since</span>
                <span className="font-medium">{formatDate(profileData.userIdObj.createdAt)}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-4 sm:mt-6">
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-bold">{stats.quizzesCreated}</span>
                  <span className="text-xs text-muted-foreground">Created</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-bold">{stats.quizzesCompleted}</span>
                  <span className="text-xs text-muted-foreground">Taken</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-bold">{stats.averageScore}%</span>
                  <span className="text-xs text-muted-foreground">Avg. Score</span>
                </div>
              </div>

              <div className="w-full mt-4 sm:mt-6">
                <h3 className="font-medium mb-3 text-sm sm:text-base">Badges</h3>
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {(() => {
                    const badge = getHighestStarBadge(stats.badges)
                    return badge ? (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center p-2 bg-muted rounded-lg transition-colors cursor-pointer animate-bounce-small"
                        title={badge.description}
                        style={{ minWidth: 56 }}
                      >
                        <span className="text-[15px] mb-1">{badge.icon}</span>
                        <span className="text-[10px] font-medium">{badge.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs sm:text-sm">No badges yet</span>
                    )
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <div className="space-y-4 sm:space-y-6">
          <Tabs value={tab} onValueChange={(value) => setTab(value as "about" | "stats" | "edit")}>
            <TabsList className="mb-4">
              <TabsTrigger value="about" className="text-sm sm:text-base">
                About
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-sm sm:text-base">
                Statistics
              </TabsTrigger>
              <TabsTrigger value="edit" className="text-sm sm:text-base">
                Edit Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about">
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
            </TabsContent>

            <TabsContent value="stats">
              <ScaleIn>
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle>Your performance and activity on</CardTitle>
                    <CardDescription>
                      <span
                        className={`font-extrabold text-xl animate-pulse text-primary-500`}
                        style={{
                          display: "inline-block",
                        }}
                      >
                        {level.text}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Points & Badges</h3>
                        <div className="flex gap-4 items-center">
                          <span className="font-bold text-lg">Points: {stats.points}</span>
                          <span className="text-muted-foreground">{stats.timeSpent} spent</span>
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {(() => {
                            const badge = getHighestStarBadge(stats.badges)
                            return badge ? (
                              <div
                                key={badge.id}
                                className="flex items-center px-2 py-1 bg-muted rounded-lg hover:bg-primary-300 transition-colors cursor-pointer"
                                title={badge.description}
                                style={{ minWidth: 56 }}
                              >
                                <span className="text-xl mr-2">{badge.icon}</span>
                                <span className="text-xs font-medium">{badge.name}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No badges yet</span>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScaleIn>
            </TabsContent>

            <TabsContent value="edit">
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
                            onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                            onChange={handleInputChange}
                            className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
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
                              onChange={handleInputChange}
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
                              onChange={handleInputChange}
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
                              onChange={handleInputChange}
                              className="rounded-l-none transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" onClick={() => setTab("about")} className="mr-2">
                      Cancel
                    </Button>
                    <GradientButton onClick={handleSaveProfile} disabled={isSaving}>
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
            </TabsContent>
          </Tabs>

          <FadeUp delay={0.2}>
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">Last updated 3 months ago</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => router.push("/dashboard/settings")}>
                    Change
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Not enabled</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => router.push("/dashboard/settings")}>
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeUp>
        </div>
      </div>
    </>
  )
}