"use client"

import { Section } from "@/components/section"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function SettingsHeader() {
  return (
    <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="animate-fade-up">
            <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
              Settings
            </h1>
          </div>
          <div className="animate-fade-up animate-delay-200">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </Section>
  )
} 