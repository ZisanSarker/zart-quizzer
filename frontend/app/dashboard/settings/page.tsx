"use client"

import React, { Suspense, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useSettingsData } from "@/hooks/use-settings-data"
import { 
  SettingsHeader
} from "@/components/settings"
import { logout as apiLogout } from "@/lib/auth"
import { LazySettingsContent, LazyDeleteAccountDialog } from "@/components/lazy-components"

export default function SettingsPage() {
  const { toast } = useToast()
  const { user, logout: authLogout } = useAuth()
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const {
    isLoading,
    isSaving,
    settings,
    handleSettingChange,
    handleSaveSettings,
    handleChangePassword,
    handleDeleteAccount
  } = useSettingsData()

  const handleLogout = async () => {
    try {
      // Call the context logout which handles session cleanup and redirect
      await authLogout()
      router.replace("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccountConfirm = async () => {
    try {
      await handleDeleteAccount()
      await authLogout()
      router.replace("/")
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-96">
        <span className="text-lg text-muted-foreground">Loading...</span>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center">
      <SettingsHeader />
      
  <Suspense fallback={<div className="space-y-6"><div className="h-8 bg-muted rounded w-1/3 animate-pulse" /><div className="space-y-4">{[1,2,3].map(i => (<div key={i} className="h-16 bg-muted rounded animate-pulse" />))}</div></div>}>
        <LazySettingsContent
          settings={settings}
          isSaving={isSaving}
          onSettingChange={handleSettingChange}
          onSaveSettings={handleSaveSettings}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
          onDeleteAccount={() => setShowDeleteDialog(true)}
        />
      </Suspense>

      <LazyDeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteAccountConfirm}
      />
    </div>
  )
}
