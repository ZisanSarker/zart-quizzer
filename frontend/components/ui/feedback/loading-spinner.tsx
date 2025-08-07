"use client"

import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ message = "Loading...", size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div className={`w-full flex flex-col items-center justify-center h-96 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mb-4`} />
      <span className="text-lg text-muted-foreground">{message}</span>
    </div>
  )
} 