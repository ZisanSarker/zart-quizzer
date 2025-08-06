"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GradientButton } from "@/components/ui/gradient-button"
import { AlertTriangle, Check, Loader2 } from "lucide-react"
import { FadeIn } from "@/components/animations/motion"

interface AccountInfoProps {
  email: string
  emailVerified: boolean
  isSaving: boolean
  onSave: () => void
}

export function AccountInfo({ email, emailVerified, isSaving, onSave }: AccountInfoProps) {
  return (
    <FadeIn>
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-muted"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {emailVerified ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Email verified
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Email not verified
                </>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <GradientButton
              onClick={onSave}
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
        </CardContent>
      </Card>
    </FadeIn>
  )
} 