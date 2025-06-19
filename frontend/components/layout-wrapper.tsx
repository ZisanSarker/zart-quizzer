import type React from "react"
import { cn } from "@/lib/utils"

interface LayoutWrapperProps {
  children: React.ReactNode
  className?: string
}

export function LayoutWrapper({ children, className }: LayoutWrapperProps) {
  return (
    <div className={cn("w-full mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center", className)}>
      {children}
    </div>
  )
}
