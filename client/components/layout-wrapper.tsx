import type React from "react"
import { cn } from "@/lib/utils"

interface LayoutWrapperProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function LayoutWrapper({ children, className, fullWidth = false }: LayoutWrapperProps) {
  return (
    <div className={cn("w-full mx-auto px-4 sm:px-6 md:px-8", fullWidth ? "max-w-full" : "max-w-7xl", className)}>
      {children}
    </div>
  )
}
