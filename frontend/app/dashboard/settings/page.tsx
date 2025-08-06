"use client"

import React, { useState } from "react"
import { GradientButton } from "@/components/ui/gradient-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Loader2 } from "lucide-react"
import { FadeIn } from "@/components/animations/motion"
import { Section } from "@/components/section"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useSettingsData } from "@/hooks/use-settings-data"
import { 
  SettingsTab, 
  PasswordForm, 
  SecurityLog, 
  AccountInfo, 
  DangerZone 
} from "@/components/dashboard"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
      {/* Settings Header Section */}
      <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="animate-fade-up">
              <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
                Settings
              </h1>
            </div>
            <div className="animate-fade-up animate-delay-200">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </Section>

      {/* Settings Content Section */}
      <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="danger">Danger</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <AccountInfo
                email={settings.account.email}
                emailVerified={settings.account.emailVerified}
                isSaving={isSaving}
                onSave={handleSaveSettings}
              />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <FadeIn>
                <SettingsTab
                  title="Notification Preferences"
                  description="Choose what notifications you want to receive"
                  settings={settings.notifications}
                  onSettingChange={(setting, checked) => 
                    handleSettingChange("notifications", setting, checked)
                  }
                />
                <div className="flex justify-end">
                  <GradientButton
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </GradientButton>
                </div>
              </FadeIn>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <FadeIn>
                <div className="grid gap-6 md:grid-cols-2">
                  <PasswordForm
                    onSubmit={handleChangePassword}
                    isSubmitting={isSaving}
                  />
                  <SecurityLog
                    lastPasswordChange={settings.security.lastPasswordChange}
                    loginHistory={settings.security.loginHistory}
                  />
                </div>
              </FadeIn>
            </TabsContent>

            <TabsContent value="danger" className="space-y-6">
              <DangerZone
                onLogout={handleLogout}
                onDeleteAccount={() => setShowDeleteDialog(true)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Section>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccountConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
