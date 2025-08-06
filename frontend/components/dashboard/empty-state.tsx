"use client"

import Link from "next/link"
import { GradientButton } from "@/components/ui/gradient-button"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionText?: string
  actionHref?: string
  actionIcon?: LucideIcon
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  actionIcon: ActionIcon
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground mb-6">
        {description}
      </p>
      {actionText && actionHref && (
        <GradientButton asChild>
          <Link href={actionHref}>
            {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
            {actionText}
          </Link>
        </GradientButton>
      )}
    </div>
  )
} 