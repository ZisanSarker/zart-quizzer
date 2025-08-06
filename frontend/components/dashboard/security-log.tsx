"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Monitor } from "lucide-react"

interface LoginHistory {
  device: string
  location: string
  time: string
}

interface SecurityLogProps {
  lastPasswordChange: string
  loginHistory: LoginHistory[]
}

export function SecurityLog({ lastPasswordChange, loginHistory }: SecurityLogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Log
        </CardTitle>
        <CardDescription>
          Recent login activity and security events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Last Password Change</h4>
          <p className="text-sm text-muted-foreground">
            {formatDate(lastPasswordChange)}
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Recent Login Activity</h4>
          <div className="space-y-3">
            {loginHistory.map((login, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{login.device}</p>
                  <p className="text-xs text-muted-foreground">
                    {login.location} • {formatDate(login.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 