"use client";

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertTriangle,
  Bell,
  Check,
  Globe,
  Key,
  Loader2,
  Lock,
  Moon,
  Palette,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { FadeIn } from "@/components/animations/motion";
import { deleteAccount } from "@/lib/user";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { logout } from "@/lib/auth";

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
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState(settingsMock);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    // Simulate API call to fetch user settings
    const fetchSettings = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await api.get(`/users/${user?._id}/settings`);
        // const data = response.data;
        // Using mock data for now
        const data = settingsMock;
        setSettings(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [toast, user]);

  const handleSwitchChange = (
    section: string,
    setting: string,
    checked: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: checked,
      },
    }));
  };

  const handleSelectChange = (
    section: string,
    setting: string,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Password validation
    if (name === "newPassword") {
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters");
      } else if (!/\d/.test(value)) {
        setPasswordError("Password must include a number");
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        setPasswordError("Password must include a special character");
      } else if (
        passwordData.confirmPassword &&
        value !== passwordData.confirmPassword
      ) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }

    // Confirm password validation
    if (name === "confirmPassword") {
      if (value !== passwordData.newPassword) {
        setPasswordError("Passwords do not match");
      } else if (
        value === passwordData.newPassword &&
        passwordError.startsWith("Passwords do not match")
      ) {
        setPasswordError("");
      }
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call to update settings
      // await api.put(`/users/${user?._id}/settings`, settings);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordError) return;
    setIsSaving(true);
    try {
      // Simulate API call to change password
      // await api.put(`/users/${user?._id}/password`, passwordData);
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully",
      });
      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-2">Loading settings...</h2>
          <p className="text-muted-foreground">
            Please wait while we load your settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">
          Settings
        </h1>
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

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full overflow-x-auto">
          {/* <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Account</span>
          </TabsTrigger> */}
          {/* <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger> */}
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account information and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 space-y-4">
                  <Label>Email Address</Label>
                  <Input type="email" value={settings.account.email} disabled />
                  {settings.account.emailVerified ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Not verified
                    </span>
                  )}
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <Label
                    htmlFor="twoFactorEnabled"
                    className="flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Two-Factor Authentication
                  </Label>
                  <Switch
                    id="twoFactorEnabled"
                    checked={settings.account.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("account", "twoFactorEnabled", checked)
                    }
                  />
                </div>
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordDialog(true)}
                  className="mt-2">
                  <Key className="h-4 w-4 mr-2" /> Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which events trigger notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </Label>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("notifications", key, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Theme</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) =>
                      handleSelectChange("appearance", "theme", value)
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <Sun className="inline h-4 w-4 mr-1" /> Light
                      </SelectItem>
                      <SelectItem value="dark">
                        <Moon className="inline h-4 w-4 mr-1" /> Dark
                      </SelectItem>
                      <SelectItem value="system">
                        <Loader2 className="inline h-4 w-4 mr-1" /> System
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Color Scheme</Label>
                  <Select
                    value={settings.appearance.colorScheme}
                    onValueChange={(value) =>
                      handleSelectChange("appearance", "colorScheme", value)
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Font Size</Label>
                  <Select
                    value={settings.appearance.fontSize}
                    onValueChange={(value) =>
                      handleSelectChange("appearance", "fontSize", value)
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Reduced Motion</Label>
                  <Switch
                    checked={settings.appearance.reducedMotion}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("appearance", "reducedMotion", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your profile and activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Profile Visibility</Label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) =>
                      handleSelectChange("privacy", "profileVisibility", value)
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Activity Status</Label>
                  <Switch
                    checked={settings.privacy.showActivityStatus}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(
                        "privacy",
                        "showActivityStatus",
                        checked
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Allow Tagging</Label>
                  <Switch
                    checked={settings.privacy.allowTagging}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("privacy", "allowTagging", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Quiz History</Label>
                  <Switch
                    checked={settings.privacy.showQuizHistory}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("privacy", "showQuizHistory", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Review your account's security information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Last Password Change</Label>
                <div className="text-muted-foreground mb-2">
                  {formatDate(settings.security.lastPasswordChange)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordDialog(true)}>
                  <Key className="h-4 w-4 mr-2" /> Change Password
                </Button>
              </div>
              {/* <div>
                <Label>Login History</Label>
                <ul className="divide-y divide-border">
                  {settings.security.loginHistory.map((login, idx) => (
                    <li
                      key={idx}
                      className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                      <span className="font-mono text-xs">{login.device}</span>
                      <span className="text-xs text-muted-foreground">
                        {login.location}
                      </span>
                      <span className="text-xs">{formatDate(login.time)}</span>
                    </li>
                  ))}
                </ul>
              </div> */}
              <div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}>
                  <AlertTriangle className="h-4 w-4 mr-2" /> Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Change Password Dialog */}
      <AlertDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your current password and a new password to update your
              account security.
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
                  passwordError && passwordData.newPassword
                    ? "border-red-500"
                    : ""
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
                  passwordError && passwordData.confirmPassword
                    ? "border-red-500"
                    : ""
                }`}
              />
              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}
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
              }>
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
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
