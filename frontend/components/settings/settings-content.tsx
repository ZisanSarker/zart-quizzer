"use client"

import { Section } from "@/components/section"
import { SettingsTabs } from "./settings-tabs"

interface SettingsContentProps {
  settings: any
  isSaving: boolean
  onSettingChange: (section: string, setting: string, checked: boolean) => void
  onSaveSettings: () => void
  onChangePassword: (data: any) => void
  onLogout: () => void
  onDeleteAccount: () => void
}

export function SettingsContent({
  settings,
  isSaving,
  onSettingChange,
  onSaveSettings,
  onChangePassword,
  onLogout,
  onDeleteAccount
}: SettingsContentProps) {
  return (
    <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <SettingsTabs
          settings={settings}
          isSaving={isSaving}
          onSettingChange={onSettingChange}
          onSaveSettings={onSaveSettings}
          onChangePassword={onChangePassword}
          onLogout={onLogout}
          onDeleteAccount={onDeleteAccount}
        />
      </div>
    </Section>
  )
} 