"use client"

import React, { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useSettingsData } from "@/hooks/use-settings-data"
import { 
  SettingsHeader, 
  SettingsContent, 
  DeleteAccountDialog 
} from "@/components/settings"
import { logout } from "@/lib/auth"

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
      await logout()
      authLogout()
      router.push("/auth/login")
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
      authLogout()
      router.push("/auth/login")
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
      
      <SettingsContent
        settings={settings}
        isSaving={isSaving}
        onSettingChange={handleSettingChange}
        onSaveSettings={handleSaveSettings}
        onChangePassword={handleChangePassword}
        onLogout={handleLogout}
        onDeleteAccount={() => setShowDeleteDialog(true)}
      />

      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteAccountConfirm}
      />
    </div>
  )
}
