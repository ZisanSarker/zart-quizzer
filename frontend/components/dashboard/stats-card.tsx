"use client"

import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/animations/motion"
import { StaggerItem } from "@/components/animations/motion"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  subtitle?: string
  isPercentage?: boolean
  isTime?: boolean
  className?: string
  children?: ReactNode
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  isPercentage = false,
  isTime = false,
  className = "",
  children
}: StatsCardProps) {
  return (
    <StaggerItem>
      <div className={`group relative h-full ${className}`}>
        {/* Glass effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 group-hover:border-primary/30 transition-all duration-500"></div>
        
        {/* Animated border gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
        
        {/* Main card content */}
        <div className="relative px-6 pt-8 pb-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
          {/* Header with Icon and Title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full border border-primary/20 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110">
                  <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
          </div>

          {/* Main Counter */}
          <div className="text-center mb-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {typeof value === 'number' ? (
                <>
                  <AnimatedCounter value={value} />
                  {isPercentage && <span className="text-2xl">%</span>}
                </>
              ) : (
                value
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {isPercentage ? "Overall Performance" : 
               isTime ? "Total Time" : "Total"}
            </p>
          </div>

          {/* Additional content */}
          {children}
          
          {/* Floating particles effect */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-primary/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
      </div>
    </StaggerItem>
  )
} 