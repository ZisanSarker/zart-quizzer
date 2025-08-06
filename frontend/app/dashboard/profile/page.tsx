"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfileData } from "@/hooks/use-profile-data"
import { 
  ProfileSidebar, 
  ProfileAbout, 
  ProfileStats, 
  ProfileEditForm, 
  ProfileSecurity 
} from "@/components/dashboard"

export default function ProfilePage() {
  const [tab, setTab] = useState<"about" | "stats" | "edit">("about")
  
  const {
    isLoading,
    isSaving,
    profileData,
    stats,
    formData,
    handleInputChange,
    handleSaveProfile,
    handleUploadPhoto
  } = useProfileData()

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

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight gradient-heading">My Profile</h1>
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 lg:grid-cols-[1fr_2fr]">
        <ProfileSidebar
          profileData={profileData}
          stats={stats}
          formData={formData}
          isEditMode={tab === "edit"}
          onUploadPhoto={handleUploadPhoto}
        />

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
              <ProfileAbout profileData={profileData} />
            </TabsContent>

            <TabsContent value="stats">
              <ProfileStats stats={stats} />
            </TabsContent>

            <TabsContent value="edit">
              <ProfileEditForm
                formData={formData}
                isSaving={isSaving}
                onInputChange={handleInputChange}
                onSave={handleSaveProfile}
                onCancel={() => setTab("about")}
              />
            </TabsContent>
          </Tabs>

          <ProfileSecurity />
        </div>
      </div>
    </>
  )
}