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
import { Camera, Check, Edit, Loader2, Lock, Mail, User } from "lucide-react"
import { FadeIn, FadeUp, ScaleIn } from "@/components/animations/motion"
import { useAuth } from "@/contexts/auth-context"

// Mock user profile data
const userProfileMock = {
  _id: "user123",
  username: "JohnDoe",
  email: "john.doe@example.com",
  profilePicture: "/placeholder.svg?height=128&width=128",
  bio: "Quiz enthusiast and lifelong learner. I love creating and taking quizzes on various topics, especially science and history.",
  location: "New York, USA",
  website: "https://johndoe.com",
  joinedDate: "2023-01-15T10:30:00Z",
  stats: {
    quizzesCreated: 24,
    quizzesTaken: 87,
    averageScore: 82,
    followers: 45,
    following: 32,
  },
  badges: [
    { id: "b1", name: "Quiz Master", description: "Created 20+ quizzes", icon: "🏆" },
    { id: "b2", name: "Perfect Score", description: "Achieved 100% on 5+ quizzes", icon: "🎯" },
    { id: "b3", name: "Early Adopter", description: "Joined during beta phase", icon: "🚀" },
  ],
  socialLinks: {
    twitter: "johndoe",
    linkedin: "johndoe",
    github: "johndoe",
  },
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(userProfileMock)
  const [formData, setFormData] = useState({
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
    // Simulate API call to fetch user profile data
    const fetchUserProfile = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await api.get(`/users/${user?._id}/profile`);
        // const data = response.data;

        // Using mock data for now
        const data = userProfileMock

        setProfileData(data)
        setFormData({
          username: data.username,
          email: data.email,
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
          twitter: data.socialLinks?.twitter || "",
          linkedin: data.socialLinks?.linkedin || "",
          github: data.socialLinks?.github || "",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [toast, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      // Simulate API call to update profile
      // In a real app, this would be an API call
      // await api.put(`/users/${user?._id}/profile`, formData);

      // Update local state with form data
      setProfileData((prev) => ({
        ...prev,
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        socialLinks: {
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          github: formData.github,
        },
      }))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUploadPhoto = () => {
    // In a real app, this would open a file picker and upload the image
    toast({
      title: "Feature coming soon",
      description: "Profile photo upload will be available soon",
    })
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-2">Loading profile...</h2>
          <p className="text-muted-foreground">Please wait while we load your profile data</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">My Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
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
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[1fr_2fr]">
        <FadeIn>
          <Card className="card-hover">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 border-4 border-primary-100">
                  <AvatarImage src={profileData.profilePicture || "/placeholder.svg"} alt={profileData.username} />
                  <AvatarFallback className="text-3xl">
                    {profileData.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-primary text-white hover:bg-primary/90"
                    onClick={handleUploadPhoto}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h2 className="text-2xl font-bold">{profileData.username}</h2>
              <p className="text-muted-foreground mt-1">{profileData.email}</p>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span>Member since</span>
                <span className="font-medium">{formatDate(profileData.joinedDate)}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-4 sm:mt-6">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">{profileData.stats.quizzesCreated}</span>
                  <span className="text-xs text-muted-foreground">Created</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">{profileData.stats.quizzesTaken}</span>
                  <span className="text-xs text-muted-foreground">Taken</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">{profileData.stats.averageScore}%</span>
                  <span className="text-xs text-muted-foreground">Avg. Score</span>
                </div>
              </div>

              <div className="w-full mt-6">
                <h3 className="font-medium mb-3">Badges</h3>
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {profileData.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex flex-col items-center p-3 bg-muted rounded-lg hover:bg-primary-50 transition-colors"
                      title={badge.description}
                    >
                      <span className="text-2xl mb-1">{badge.icon}</span>
                      <span className="text-xs font-medium">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <div className="space-y-6">
          <Tabs defaultValue={isEditing ? "edit" : "about"}>
            <TabsList className="mb-4">
              <TabsTrigger value="about" disabled={isEditing}>
                About
              </TabsTrigger>
              <TabsTrigger value="stats" disabled={isEditing}>
                Statistics
              </TabsTrigger>
              <TabsTrigger value="edit" disabled={!isEditing}>
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
                            className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary-50 transition-colors"
                          >
                            Twitter
                          </a>
                        )}
                        {profileData.socialLinks?.linkedin && (
                          <a
                            href={`https://linkedin.com/in/${profileData.socialLinks.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary-50 transition-colors"
                          >
                            LinkedIn
                          </a>
                        )}
                        {profileData.socialLinks?.github && (
                          <a
                            href={`https://github.com/${profileData.socialLinks.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary-50 transition-colors"
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
                    <CardTitle>Quiz Statistics</CardTitle>
                    <CardDescription>Your performance and activity on QuizGenius</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Performance by Category</h3>
                        <div className="space-y-4">
                          {[
                            { category: "Mathematics", score: 92, quizzes: 12 },
                            { category: "Science", score: 85, quizzes: 8 },
                            { category: "History", score: 78, quizzes: 6 },
                            { category: "Literature", score: 88, quizzes: 4 },
                          ].map((item) => (
                            <div key={item.category} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">{item.category}</div>
                                <div className="text-sm text-muted-foreground">{item.quizzes} quizzes</div>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${item.score}%` }}></div>
                              </div>
                              <div className="text-sm text-right">{item.score}% average</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Activity Timeline</h3>
                        <div className="space-y-3">
                          {[
                            {
                              action: "Completed Quiz",
                              quiz: "Mathematics - Calculus Fundamentals",
                              date: "2023-06-15T14:30:00Z",
                              score: 85,
                            },
                            {
                              action: "Created Quiz",
                              quiz: "History - Ancient Civilizations",
                              date: "2023-06-10T09:15:00Z",
                            },
                            {
                              action: "Completed Quiz",
                              quiz: "Science - Quantum Physics",
                              date: "2023-06-05T16:45:00Z",
                              score: 72,
                            },
                            {
                              action: "Earned Badge",
                              badge: "Quiz Master",
                              date: "2023-06-01T11:20:00Z",
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                              <div>
                                <div className="font-medium">
                                  {item.action}{" "}
                                  {item.quiz && <span className="font-normal text-muted-foreground">{item.quiz}</span>}
                                  {item.badge && (
                                    <span className="font-normal text-muted-foreground">{item.badge}</span>
                                  )}
                                  {item.score !== undefined && (
                                    <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                                      {item.score}%
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(item.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
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
                            onChange={handleInputChange}
                            className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
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
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="mr-2">
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