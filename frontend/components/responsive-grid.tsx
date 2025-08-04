import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    "2xl"?: number
  }
  gap?: string
  gapX?: string
  gapY?: string
  autoFit?: boolean
  autoFill?: boolean
  minWidth?: string
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = "gap-4 sm:gap-6",
  gapX,
  gapY,
  autoFit = false,
  autoFill = false,
  minWidth = "min-w-[250px]",
}: ResponsiveGridProps) {
  const getGridCols = () => {
    if (autoFit) {
      return `grid-cols-[repeat(auto-fit,minmax(${minWidth},1fr))]`
    }
    
    if (autoFill) {
      return `grid-cols-[repeat(auto-fill,minmax(${minWidth},1fr))]`
    }

    const colClasses = []

    colClasses.push(`grid-cols-${cols.default}`)
    if (cols.sm) colClasses.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) colClasses.push(`xl:grid-cols-${cols.xl}`)
    if (cols["2xl"]) colClasses.push(`2xl:grid-cols-${cols["2xl"]}`)

    return colClasses.join(" ")
  }

  const getGapClasses = () => {
    if (gapX && gapY) {
      return `${gapX} ${gapY}`
    }
    return gap
  }

  return (
    <div 
      className={cn(
        `grid ${getGridCols()} ${getGapClasses()}`,
        className
      )}
    >
      {children}
    </div>
  )
}

// Predefined responsive grid layouts
export const ResponsiveGridLayouts = {
  // Single column on mobile, 2 on tablet, 3 on desktop
  standard: { default: 1, sm: 2, lg: 3 },
  
  // Single column on mobile, 2 on tablet, 4 on desktop
  wide: { default: 1, sm: 2, lg: 4 },
  
  // Single column on mobile, 3 on tablet, 6 on desktop
  gallery: { default: 1, sm: 3, lg: 6 },
  
  // Single column on mobile, 2 on tablet, 3 on desktop, 4 on xl
  extended: { default: 1, sm: 2, lg: 3, xl: 4 },
  
  // Auto-fit grid for cards
  autoFit: { autoFit: true, minWidth: "min-w-[280px]" },
  
  // Auto-fill grid for items
  autoFill: { autoFill: true, minWidth: "min-w-[200px]" },
  
  // Mobile-first single column
  mobile: { default: 1 },
  
  // Two columns from tablet up
  tablet: { default: 1, md: 2 },
  
  // Three columns from desktop up
  desktop: { default: 1, lg: 3 },
}
