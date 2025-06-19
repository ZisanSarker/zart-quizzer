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
import DashboardLayout from "@/components/dashboard-layout"
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
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-center">
            <h2 className="text-2xl font-bold mb-2">Loading settings...</h2>
            <p className="text-muted-foreground">Please wait while we load your settings</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
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

        <TabsContent value="account">
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Input id="email" value={settings.account.email} readOnly className="bg-muted" />
                    {settings.account.emailVerified ? (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <Check className="h-4 w-4" />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm">
                        Verify
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="outline" size="sm" onClick={() => setShowPasswordDialog(true)}>
                      Change Password
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last changed on {formatDate(settings.security.lastPasswordChange)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={settings.account.twoFactorEnabled}
                      onCheckedChange={(checked) => handleSwitchChange("account", "twoFactorEnabled", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium text-lg text-destructive mb-2">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        <TabsContent value="notifications">
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("notifications", "emailNotifications", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="quiz-reminders">Quiz Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminders about quizzes you've saved</p>
                    </div>
                    <Switch
                      id="quiz-reminders"
                      checked={settings.notifications.quizReminders}
                      onCheckedChange={(checked) => handleSwitchChange("notifications", "quizReminders", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="new-followers">New Followers</Label>
                      <p className="text-sm text-muted-foreground">Get notified when someone follows you</p>
                    </div>
                    <Switch
                      id="new-followers"
                      checked={settings.notifications.newFollowers}
                      onCheckedChange={(checked) => handleSwitchChange("notifications", "newFollowers", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="quiz-comments">Quiz Comments</Label>
                      <p className="text-sm text-muted-foreground">Get notified when someone comments on your quiz</p>
                    </div>
                    <Switch
                      id="quiz-comments"
                      checked={settings.notifications.quizComments}
                      onCheckedChange={(checked) => handleSwitchChange("notifications", "quizComments", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={settings.notifications.marketingEmails}
                      onCheckedChange={(checked) => handleSwitchChange("notifications", "marketingEmails", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        <TabsContent value="appearance">
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how QuizGenius looks for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
                        settings.appearance.theme === "light"
                          ? "border-primary bg-primary/5"
                          : "border-input hover:border-primary/50"
                      }`}
                      onClick={() => handleSelectChange("appearance", "theme", "light")}
                    >
                      <Sun className="h-6 w-6" />
                      <span className="text-sm font-medium">Light</span>
                    </div>
                    <div
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
                        settings.appearance.theme === "dark"
                          ? "border-primary bg-primary/5"
                          : "border-input hover:border-primary/50"
                      }`}
                      onClick={() => handleSelectChange("appearance", "theme", "dark")}
                    >
                      <Moon className="h-6 w-6" />
                      <span className="text-sm font-medium">Dark</span>
                    </div>
                    <div
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
                        settings.appearance.theme === "system"
                          ? "border-primary bg-primary/5"
                          : "border-input hover:border-primary/50"
                      }`}
                      onClick={() => handleSelectChange("appearance", "theme", "system")}
                    >
                      <div className="flex">
                        <Sun className="h-6 w-6" />
                        <Moon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">System</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color-scheme">Color Scheme</Label>
                  <Select
                    value={settings.appearance.colorScheme}
                    onValueChange={(value) => handleSelectChange("appearance", "colorScheme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select
                    value={settings.appearance.fontSize}
                    onValueChange={(value) => handleSelectChange("appearance", "fontSize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="reduced-motion">Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations for accessibility</p>
                    </div>
                    <Switch
                      id="reduced-motion"
                      checked={settings.appearance.reducedMotion}
                      onCheckedChange={(checked) => handleSwitchChange("appearance", "reducedMotion", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        <TabsContent value="privacy">
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and visibility on QuizGenius</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => handleSelectChange("privacy", "profileVisibility", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public (Everyone can see)</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="private">Private (Only you)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="activity-status">Show Activity Status</Label>
                      <p className="text-sm text-muted-foreground">Let others see when you're active on QuizGenius</p>
                    </div>
                    <Switch
                      id="activity-status"
                      checked={settings.privacy.showActivityStatus}
                      onCheckedChange={(checked) => handleSwitchChange("privacy", "showActivityStatus", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="allow-tagging">Allow Tagging</Label>
                      <p className="text-sm text-muted-foreground">Allow others to tag you in quizzes and comments</p>
                    </div>
                    <Switch
                      id="allow-tagging"
                      checked={settings.privacy.allowTagging}
                      onCheckedChange={(checked) => handleSwitchChange("privacy", "allowTagging", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="quiz-history">Show Quiz History</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see quizzes you've taken</p>
                    </div>
                    <Switch
                      id="quiz-history"
                      checked={settings.privacy.showQuizHistory}
                      onCheckedChange={(checked) => handleSwitchChange("privacy", "showQuizHistory", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border border-muted">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Privacy Notice</h3>
                      <p className="text-sm text-muted-foreground">
                        Your privacy is important to us. We only collect and use your data as described in our{" "}
                        <a href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                        . You can request a copy of your data or delete your account at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        <TabsContent value="security">
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and login history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label>Password</Label>
                      <p className="text-sm text-muted-foreground">
                        Last changed on {formatDate(settings.security.lastPasswordChange)}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                      <Key className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button
                      variant={settings.account.twoFactorEnabled ? "outline" : "default"}
                      onClick={() =>
                        handleSwitchChange("account", "twoFactorEnabled", !settings.account.twoFactorEnabled)
                      }
                    >
                      {settings.account.twoFactorEnabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Recent Login Activity</Label>
                  <div className="space-y-3 mt-2">
                    {settings.security.loginHistory.map((login, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{login.device}</div>
                          <div className="text-sm text-muted-foreground">{login.location}</div>
                        </div>
                        <div className="text-sm text-right">
                          {new Date(login.time).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border border-muted">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Account Security Tips</h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>Use a strong, unique password for your account</li>
                        <li>Enable two-factor authentication for extra security</li>
                        <li>Never share your password or verification codes</li>
                        <li>Check your login history regularly for suspicious activity</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>
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
    </DashboardLayout>
  )
}
