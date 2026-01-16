import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  center?: boolean
  as?: keyof JSX.IntrinsicElements
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = "7xl",
  padding = "md",
  center = true,
  as: Component = "div",
  ...props
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  }

  const paddingClasses = {
    none: "",
    sm: "px-2 sm:px-4",
    md: "px-3 sm:px-4 lg:px-6",
    lg: "px-4 sm:px-6 lg:px-8",
    xl: "px-6 sm:px-8 lg:px-12",
  }

  return (
    <Component
      className={cn(
        "w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        center && "mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

interface ResponsiveSectionProps {
  children: ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  background?: "none" | "muted" | "primary" | "secondary"
  as?: keyof JSX.IntrinsicElements
}

export function ResponsiveSection({
  children,
  className,
  padding = "md",
  background = "none",
  as: Component = "section",
  ...props
}: ResponsiveSectionProps) {
  const paddingClasses = {
    none: "",
    sm: "py-4 sm:py-6",
    md: "py-6 sm:py-8 lg:py-12",
    lg: "py-8 sm:py-12 lg:py-16",
    xl: "py-12 sm:py-16 lg:py-20",
  }

  const backgroundClasses = {
    none: "",
    muted: "bg-muted/50",
    primary: "bg-primary/5",
    secondary: "bg-secondary/5",
  }

  return (
    <Component
      className={cn(
        "w-full",
        paddingClasses[padding],
        backgroundClasses[background],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

interface ResponsiveGridProps {
  children: ReactNode
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

// Static class mappings for Tailwind JIT compatibility
const gridColsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
}

const smGridColsMap: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
}

const mdGridColsMap: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
}

const lgGridColsMap: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
}

const xlGridColsMap: Record<number, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
}

const xl2GridColsMap: Record<number, string> = {
  1: "2xl:grid-cols-1",
  2: "2xl:grid-cols-2",
  3: "2xl:grid-cols-3",
  4: "2xl:grid-cols-4",
  5: "2xl:grid-cols-5",
  6: "2xl:grid-cols-6",
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
}: ResponsiveGridProps) {
  const getGridCols = () => {
    // Use CSS custom properties for auto-fit/auto-fill (these work inline)
    if (autoFit) {
      return "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]"
    }

    if (autoFill) {
      return "grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"
    }

    const colClasses = []

    if (cols.default && gridColsMap[cols.default]) colClasses.push(gridColsMap[cols.default])
    if (cols.sm && smGridColsMap[cols.sm]) colClasses.push(smGridColsMap[cols.sm])
    if (cols.md && mdGridColsMap[cols.md]) colClasses.push(mdGridColsMap[cols.md])
    if (cols.lg && lgGridColsMap[cols.lg]) colClasses.push(lgGridColsMap[cols.lg])
    if (cols.xl && xlGridColsMap[cols.xl]) colClasses.push(xlGridColsMap[cols.xl])
    if (cols["2xl"] && xl2GridColsMap[cols["2xl"]]) colClasses.push(xl2GridColsMap[cols["2xl"]])

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
        "grid",
        getGridCols(),
        getGapClasses(),
        className
      )}
    >
      {children}
    </div>
  )
}

interface ResponsiveFlexProps {
  children: ReactNode
  className?: string
  direction?: "row" | "col" | "row-reverse" | "col-reverse"
  responsiveDirection?: {
    default: "row" | "col"
    sm?: "row" | "col"
    md?: "row" | "col"
    lg?: "row" | "col"
    xl?: "row" | "col"
  }
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  wrap?: boolean
  gap?: string
}

export function ResponsiveFlex({
  children,
  className,
  direction = "row",
  responsiveDirection,
  align = "start",
  justify = "start",
  wrap = false,
  gap = "gap-4",
}: ResponsiveFlexProps) {
  const getDirectionClasses = () => {
    if (responsiveDirection) {
      const classes = []
      classes.push(`flex-${responsiveDirection.default}`)
      if (responsiveDirection.sm) classes.push(`sm:flex-${responsiveDirection.sm}`)
      if (responsiveDirection.md) classes.push(`md:flex-${responsiveDirection.md}`)
      if (responsiveDirection.lg) classes.push(`lg:flex-${responsiveDirection.lg}`)
      if (responsiveDirection.xl) classes.push(`xl:flex-${responsiveDirection.xl}`)
      return classes.join(" ")
    }
    return `flex-${direction}`
  }

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  }

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  }

  return (
    <div
      className={cn(
        "flex",
        getDirectionClasses(),
        alignClasses[align],
        justifyClasses[justify],
        wrap && "flex-wrap",
        gap,
        className
      )}
    >
      {children}
    </div>
  )
}

// Predefined responsive layouts
export const ResponsiveLayouts = {
  // Container layouts
  container: {
    sm: { maxWidth: "sm", padding: "md" },
    md: { maxWidth: "md", padding: "md" },
    lg: { maxWidth: "lg", padding: "md" },
    xl: { maxWidth: "xl", padding: "md" },
    "2xl": { maxWidth: "2xl", padding: "md" },
    "3xl": { maxWidth: "3xl", padding: "md" },
    "4xl": { maxWidth: "4xl", padding: "md" },
    "5xl": { maxWidth: "5xl", padding: "md" },
    "6xl": { maxWidth: "6xl", padding: "md" },
    "7xl": { maxWidth: "7xl", padding: "md" },
    full: { maxWidth: "full", padding: "md" },
  },

  // Grid layouts
  grid: {
    standard: { default: 1, sm: 2, lg: 3 },
    wide: { default: 1, sm: 2, lg: 4 },
    gallery: { default: 1, sm: 3, lg: 6 },
    extended: { default: 1, sm: 2, lg: 3, xl: 4 },
    autoFit: { autoFit: true, minWidth: "min-w-[280px]" },
    autoFill: { autoFill: true, minWidth: "min-w-[200px]" },
    mobile: { default: 1 },
    tablet: { default: 1, md: 2 },
    desktop: { default: 1, lg: 3 },
  },

  // Flex layouts
  flex: {
    row: { direction: "row" },
    col: { direction: "col" },
    responsive: { responsiveDirection: { default: "col", sm: "row" } },
    responsiveReverse: { responsiveDirection: { default: "col", lg: "row" } },
  },
} 