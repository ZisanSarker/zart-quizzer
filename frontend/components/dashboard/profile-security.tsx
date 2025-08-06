"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { FadeUp } from "@/components/animations/motion"
import { useRouter } from "next/navigation"

interface ProfileSecurityProps {
  delay?: number
}

export function ProfileSecurity({ delay = 0.2 }: ProfileSecurityProps) {
  const router = useRouter()

  return (
    <FadeUp delay={delay}>
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">Last updated 3 months ago</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/dashboard/settings")}>
              Change
            </Button>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Not enabled</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/dashboard/settings")}>
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>
    </FadeUp>
  )
} 