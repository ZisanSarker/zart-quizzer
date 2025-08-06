"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface SettingsTabProps {
  title: string
  description: string
  settings: Record<string, boolean>
  onSettingChange: (setting: string, checked: boolean) => void
}

export function SettingsTab({ title, description, settings, onSettingChange }: SettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Label>
              <p className="text-xs text-muted-foreground">
                {getSettingDescription(key)}
              </p>
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) => onSettingChange(key, checked)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function getSettingDescription(setting: string): string {
  const descriptions: Record<string, string> = {
    emailNotifications: "Receive notifications via email",
    quizReminders: "Get reminded about incomplete quizzes",
    newFollowers: "Notify when someone follows you",
    quizComments: "Notify about comments on your quizzes",
    marketingEmails: "Receive promotional emails",
    twoFactorEnabled: "Add an extra layer of security to your account"
  }
  return descriptions[setting] || "Toggle this setting"
} 