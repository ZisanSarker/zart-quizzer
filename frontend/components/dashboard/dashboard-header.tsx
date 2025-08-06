"use client"

import Link from "next/link"
import { GradientButton } from "@/components/ui/gradient-button"
import { Section } from "@/components/section"
import { LucideIcon } from "lucide-react"

interface DashboardHeaderProps {
  title: string
  actionText?: string
  actionHref?: string
  actionIcon?: LucideIcon
  description?: string
}

export function DashboardHeader({
  title,
  actionText,
  actionHref,
  actionIcon: ActionIcon,
  description
}: DashboardHeaderProps) {
  return (
    <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="animate-fade-up">
            <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actionText && actionHref && (
            <div className="animate-fade-up animate-delay-200">
              <GradientButton asChild className="w-full sm:w-auto touch-target">
                <Link href={actionHref}>
                  {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                  {actionText}
                </Link>
              </GradientButton>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
} 