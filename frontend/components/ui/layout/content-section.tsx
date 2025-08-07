"use client"

import { Section } from "@/components/section"

interface ContentSectionProps {
  children: React.ReactNode
  className?: string
}

export function ContentSection({ children, className = "" }: ContentSectionProps) {
  return (
    <Section className={`py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl ${className}`}>
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {children}
      </div>
    </Section>
  )
} 