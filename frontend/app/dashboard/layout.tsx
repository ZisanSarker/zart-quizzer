"use client"

import { type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"

// Auth redirect is handled by middleware.ts
// This layout only handles loading state

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}