"use client"

import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  return (
    <div className={`w-full flex flex-col items-center justify-center h-96 ${className}`}>
      <AlertCircle className="h-6 w-6 text-destructive mb-4" />
      <span className="text-lg text-muted-foreground">{message}</span>
    </div>
  )
} 