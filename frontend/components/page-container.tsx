import type React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn("w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8", className)}>{children}</div>
}
