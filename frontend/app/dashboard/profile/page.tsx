"use client"

import { Suspense, useState } from "react"
import dynamic from "next/dynamic"
import { useProfileData } from "@/hooks/use-profile-data"
import { LoadingSpinner } from "@/components/ui/feedback"
import { 
  LazyProfileSidebar,
  LazyProfileAbout,
  LazyProfileStats,
  LazyProfileEditForm,
  LazyProfileSecurity,
} from "@/components/lazy-components"

// Lazy load Tabs primitives
const Tabs = dynamic(() => import('@/components/ui/tabs').then(mod => mod.Tabs))
const TabsContent = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsContent))
const TabsList = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsList))
const TabsTrigger = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsTrigger))

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
        <LazyProfileSidebar
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
              <Suspense fallback={<div className="h-64 bg-muted rounded animate-pulse" />}>
                <LazyProfileAbout profileData={profileData} />
              </Suspense>
            </TabsContent>

            <TabsContent value="stats">
              <Suspense fallback={<div className="h-48 bg-muted rounded animate-pulse" />}>
                <LazyProfileStats stats={stats} />
              </Suspense>
            </TabsContent>

            <TabsContent value="edit">
              <Suspense fallback={<div className="space-y-4">{[1,2,3,4].map(i => (<div key={i} className="h-16 bg-muted rounded animate-pulse" />))}</div>}>
                <LazyProfileEditForm
                formData={formData}
                isSaving={isSaving}
                onInputChange={handleInputChange}
                onSave={handleSaveProfile}
                onCancel={() => setTab("about")}
                />
              </Suspense>
            </TabsContent>
          </Tabs>
          <Suspense fallback={<div className="space-y-4">{[1,2,3].map(i => (<div key={i} className="h-16 bg-muted rounded animate-pulse" />))}</div>}>
            <LazyProfileSecurity />
          </Suspense>
        </div>
      </div>
    </>
  )
}