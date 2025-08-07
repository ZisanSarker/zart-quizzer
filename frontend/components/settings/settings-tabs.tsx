"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradientButton } from "@/components/ui/gradient-button"
import { Loader2 } from "lucide-react"
import { FadeIn } from "@/components/animations/motion"
import { 
  SettingsTab, 
  PasswordForm, 
  SecurityLog, 
  AccountInfo, 
  DangerZone 
} from "@/components/dashboard"

interface SettingsTabsProps {
  settings: any
  isSaving: boolean
  onSettingChange: (section: string, setting: string, checked: boolean) => void
  onSaveSettings: () => void
  onChangePassword: (data: any) => void
  onLogout: () => void
  onDeleteAccount: () => void
}

export function SettingsTabs({
  settings,
  isSaving,
  onSettingChange,
  onSaveSettings,
  onChangePassword,
  onLogout,
  onDeleteAccount
}: SettingsTabsProps) {
  return (
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
          onSave={onSaveSettings}
        />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <FadeIn>
          <SettingsTab
            title="Notification Preferences"
            description="Choose what notifications you want to receive"
            settings={settings.notifications}
            onSettingChange={(setting, checked) => 
              onSettingChange("notifications", setting, checked)
            }
          />
          <div className="flex justify-end">
            <GradientButton
              onClick={onSaveSettings}
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
              onSubmit={onChangePassword}
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
          onLogout={onLogout}
          onDeleteAccount={onDeleteAccount}
        />
      </TabsContent>
    </Tabs>
  )
} 