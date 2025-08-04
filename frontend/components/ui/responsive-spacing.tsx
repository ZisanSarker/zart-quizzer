import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const responsiveSpacingVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        section: "py-12 sm:py-16 lg:py-20",
        container: "px-3 sm:px-4 lg:px-6",
        card: "p-4 sm:p-6",
        button: "px-4 py-2 sm:px-6 sm:py-3",
        input: "px-3 py-2 sm:px-4 sm:py-3",
        nav: "px-3 py-2 sm:px-4 sm:py-3",
        sidebar: "p-4 sm:p-6",
        modal: "p-4 sm:p-6 lg:p-8",
        form: "space-y-4 sm:space-y-6",
        grid: "gap-4 sm:gap-6 lg:gap-8",
        flex: "gap-2 sm:gap-4 lg:gap-6",
      },
      size: {
        default: "",
        sm: "p-2 sm:p-3",
        md: "p-4 sm:p-6",
        lg: "p-6 sm:p-8 lg:p-12",
        xl: "p-8 sm:p-12 lg:p-16",
        // Mobile-first responsive sizes
        mobile: "p-4",
        tablet: "p-4 sm:p-6",
        desktop: "p-6 sm:p-8",
        hero: "py-12 sm:py-16 lg:py-20 xl:py-24",
        compact: "p-2 sm:p-3",
        spacious: "p-8 sm:p-12 lg:p-16",
      },
      responsive: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      responsive: true,
    },
  }
)

const responsiveMarginVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        section: "my-8 sm:my-12 lg:my-16",
        container: "mx-auto",
        card: "mb-4 sm:mb-6",
        button: "mb-2 sm:mb-4",
        input: "mb-3 sm:mb-4",
        nav: "mb-2 sm:mb-4",
        sidebar: "mr-4 sm:mr-6",
        modal: "my-4 sm:my-8",
        form: "mb-6 sm:mb-8",
        grid: "mb-4 sm:mb-6",
        flex: "mb-2 sm:mb-4",
      },
      size: {
        default: "",
        sm: "m-2 sm:m-3",
        md: "m-4 sm:m-6",
        lg: "m-6 sm:m-8 lg:m-12",
        xl: "m-8 sm:m-12 lg:m-16",
        // Mobile-first responsive sizes
        mobile: "m-4",
        tablet: "m-4 sm:m-6",
        desktop: "m-6 sm:m-8",
        hero: "my-12 sm:my-16 lg:my-20 xl:my-24",
        compact: "m-2 sm:m-3",
        spacious: "m-8 sm:m-12 lg:m-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const responsivePaddingVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        section: "py-8 sm:py-12 lg:py-16",
        container: "px-3 sm:px-4 lg:px-6",
        card: "p-4 sm:p-6",
        button: "px-4 py-2 sm:px-6 sm:py-3",
        input: "px-3 py-2 sm:px-4 sm:py-3",
        nav: "px-3 py-2 sm:px-4 sm:py-3",
        sidebar: "p-4 sm:p-6",
        modal: "p-4 sm:p-6 lg:p-8",
        form: "p-4 sm:p-6",
        grid: "p-4 sm:p-6",
        flex: "p-2 sm:p-4",
      },
      size: {
        default: "",
        sm: "p-2 sm:p-3",
        md: "p-4 sm:p-6",
        lg: "p-6 sm:p-8 lg:p-12",
        xl: "p-8 sm:p-12 lg:p-16",
        // Mobile-first responsive sizes
        mobile: "p-4",
        tablet: "p-4 sm:p-6",
        desktop: "p-6 sm:p-8",
        hero: "py-12 sm:py-16 lg:py-20 xl:py-24",
        compact: "p-2 sm:p-3",
        spacious: "p-8 sm:p-12 lg:p-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const responsiveGapVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        section: "gap-8 sm:gap-12 lg:gap-16",
        container: "gap-4 sm:gap-6",
        card: "gap-4 sm:gap-6",
        button: "gap-2 sm:gap-4",
        input: "gap-3 sm:gap-4",
        nav: "gap-2 sm:gap-4",
        sidebar: "gap-4 sm:gap-6",
        modal: "gap-4 sm:gap-6 lg:gap-8",
        form: "gap-4 sm:gap-6",
        grid: "gap-4 sm:gap-6 lg:gap-8",
        flex: "gap-2 sm:gap-4 lg:gap-6",
      },
      size: {
        default: "",
        sm: "gap-2 sm:gap-3",
        md: "gap-4 sm:gap-6",
        lg: "gap-6 sm:gap-8 lg:gap-12",
        xl: "gap-8 sm:gap-12 lg:gap-16",
        // Mobile-first responsive sizes
        mobile: "gap-4",
        tablet: "gap-4 sm:gap-6",
        desktop: "gap-6 sm:gap-8",
        hero: "gap-12 sm:gap-16 lg:gap-20 xl:gap-24",
        compact: "gap-2 sm:gap-3",
        spacious: "gap-8 sm:gap-12 lg:gap-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ResponsiveSpacingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof responsiveSpacingVariants> {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
}

const ResponsiveSpacing = React.forwardRef<HTMLDivElement, ResponsiveSpacingProps>(
  ({ className, variant, size, responsive, as: Component = "div", children, ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(responsiveSpacingVariants({ variant, size, responsive }), className)}
      {...props}
    >
      {children}
    </Component>
  )
)
ResponsiveSpacing.displayName = "ResponsiveSpacing"

const ResponsiveMargin = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof responsiveMarginVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(responsiveMarginVariants({ variant, size }), className)}
    {...props}
  />
))
ResponsiveMargin.displayName = "ResponsiveMargin"

const ResponsivePadding = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof responsivePaddingVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(responsivePaddingVariants({ variant, size }), className)}
    {...props}
  />
))
ResponsivePadding.displayName = "ResponsivePadding"

const ResponsiveGap = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof responsiveGapVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(responsiveGapVariants({ variant, size }), className)}
    {...props}
  />
))
ResponsiveGap.displayName = "ResponsiveGap"

// Predefined responsive spacing configurations
export const ResponsiveSpacingConfigs = {
  // Mobile-first spacing
  mobile: {
    variant: "default" as const,
    size: "mobile" as const,
    responsive: true,
  },
  
  // Tablet spacing
  tablet: {
    variant: "default" as const,
    size: "tablet" as const,
    responsive: true,
  },
  
  // Desktop spacing
  desktop: {
    variant: "default" as const,
    size: "desktop" as const,
    responsive: true,
  },
  
  // Section spacing
  section: {
    variant: "section" as const,
    size: "hero" as const,
    responsive: true,
  },
  
  // Container spacing
  container: {
    variant: "container" as const,
    size: "default" as const,
    responsive: true,
  },
  
  // Card spacing
  card: {
    variant: "card" as const,
    size: "default" as const,
    responsive: true,
  },
  
  // Compact spacing
  compact: {
    variant: "default" as const,
    size: "compact" as const,
    responsive: true,
  },
  
  // Spacious spacing
  spacious: {
    variant: "default" as const,
    size: "spacious" as const,
    responsive: true,
  },
}

export {
  ResponsiveSpacing,
  ResponsiveMargin,
  ResponsivePadding,
  ResponsiveGap,
} 