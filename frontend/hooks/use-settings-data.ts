"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { changePassword, deleteAccount } from "@/lib/user"

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
  security: {
    lastPasswordChange: "2023-03-15T10:30:00Z",
    loginHistory: [
      {
        device: "Chrome on Windows",
        location: "New York, USA",
        time: "2023-06-15T14:30:00Z",
      },
      {
        device: "Safari on iPhone",
        location: "New York, USA",
        time: "2023-06-14T09:15:00Z",
      },
      {
        device: "Firefox on MacOS",
        location: "Boston, USA",
        time: "2023-06-10T16:45:00Z",
      },
    ],
  },
}

export function useSettingsData() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState(settingsMock)

  useEffect(() => {
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

  const handleSettingChange = (section: string, setting: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: checked,
      },
    }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate API call to update settings
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

  const handleChangePassword = async (passwordData: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<void> => {
    setIsSaving(true)
    try {
      await changePassword(passwordData)
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsSaving(true)
    try {
      await deleteAccount()
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  return {
    isLoading,
    isSaving,
    settings,
    handleSettingChange,
    handleSaveSettings,
    handleChangePassword,
    handleDeleteAccount
  }
} 