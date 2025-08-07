"use client"

import { Section } from "@/components/section"

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({ title, description, className = "" }: PageHeaderProps) {
  return (
    <Section className={`py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl ${className}`}>
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="animate-fade-up">
            <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground text-sm sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
} 