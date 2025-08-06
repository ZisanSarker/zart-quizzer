"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { FadeIn } from "@/components/animations/motion"

interface DangerZoneProps {
  onLogout: () => void
  onDeleteAccount: () => void
}

export function DangerZone({ onLogout, onDeleteAccount }: DangerZoneProps) {
  return (
    <FadeIn>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Logout
            </CardTitle>
            <CardDescription>
              Sign out of your account on this device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={onLogout}
              className="w-full"
            >
              Logout
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={onDeleteAccount}
              className="w-full"
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  )
} 