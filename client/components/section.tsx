import type React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
}

export function Section({ children, className }: SectionProps) {
  return <section className={cn("w-full mb-6 sm:mb-8 lg:mb-10", className)}>{children}</section>
}
