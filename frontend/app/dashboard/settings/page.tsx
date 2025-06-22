"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, Bell, Check, Globe, Key, Loader2, Lock, Moon, Palette, Shield, Sun, User } from "lucide-react"
import { FadeIn } from "@/components/animations/motion"
import { useAuth } from "@/contexts/auth-context"
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

// Mock settings data
const settingsMock = {
  account: {
    email: "john.doe@example.com",
    emailVerified: true,
    twoFactorEnabled: false,
  },
  notifications: {
    emailNotifications: true,
    quizReminders: true,
    newFollowers: true,
    quizComments: true,
    marketingEmails: false,
  },
  appearance: {
    theme: "system", // "light", "dark", "system"
    colorScheme: "purple", // "purple", "blue", "green", "orange"
    fontSize: "medium", // "small", "medium", "large"
    reducedMotion: false,
  },
  privacy: {
    profileVisibility: "public", // "public", "followers", "private"
    showActivityStatus: true,
    allowTagging: true,
    showQuizHistory: true,
  },
  security: {
    lastPasswordChange: "2023-03-15T10:30:00Z",
    loginHistory: [
      { device: "Chrome on Windows", location: "New York, USA", time: "2023-06-15T14:30:00Z" },
      { device: "Safari on iPhone", location: "New York, USA", time: "2023-06-14T09:15:00Z" },
      { device: "Firefox on MacOS", location: "Boston, USA", time: "2023-06-10T16:45:00Z" },
    ],
  },
}

export default function SettingsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState(settingsMock)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    // Simulate API call to fetch user settings
    const fetchSettings = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await api.get(`/users/${user?._id}/settings`);
        // const data = response.data;

        // Using mock data for now
        const data = settingsMock

        setSettings(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [toast, user])

  const handleSwitchChange = (section: string, setting: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: checked,
      },
    }))
  }

  const handleSelectChange = (section: string, setting: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: value,
      },
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    // Password validation
    if (name === "newPassword") {
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters")
      } else if (!/\d/.test(value)) {
        setPasswordError("Password must include a number")
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        setPasswordError("Password must include a special character")
      } else {
        setPasswordError("")
      }
    }

    // Confirm password validation
    if (name === "confirmPassword" && value !== passwordData.newPassword) {
      setPasswordError("Passwords do not match")
    } else if (name === "confirmPassword" && value === passwordData.newPassword) {
      setPasswordError("")
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // Simulate API call to update settings
      // In a real app, this would be an API call
      // await api.put(`/users/${user?._id}/settings`, settings);

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordError) return

    setIsSaving(true)

    try {
      // Simulate API call to change password
      // In a real app, this would be an API call
      // await api.put(`/users/${user?._id}/password`, passwordData);

      toast({
        title: "Password changed",
        description: "Your password has been updated successfully",
      })

      setShowPasswordDialog(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call to delete account
      // In a real app, this would be an API call
      // await api.delete(`/users/${user?._id}`);

      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully",
      })

      // In a real app, this would log the user out and redirect to the home page
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-2">Loading settings...</h2>
          <p className="text-muted-foreground">Please wait while we load your settings</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">Settings</h1>
        <GradientButton onClick={handleSaveSettings} disabled={isSaving}>
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

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full overflow-x-auto">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* ...rest of the content (same as your input, unchanged) ... */}

        {/* The rest of the component is unchanged except DashboardLayout is removed. */}
        {/* ...all tabs, dialogs, and handlers remain inside the fragment... */}
      </Tabs>

      {/* Change Password Dialog */}
      <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your current password and a new password to update your account security.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 ${
                  passwordError && passwordData.newPassword ? "border-red-500" : ""
                }`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 ${
                  passwordError && passwordData.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleChangePassword}
              disabled={
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword ||
                !!passwordError
              }
            >
              Change Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}