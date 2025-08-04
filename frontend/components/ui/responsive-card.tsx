import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const responsiveCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2",
        ghost: "border-0 shadow-none",
        elevated: "shadow-lg",
        interactive: "cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1",
      },
      size: {
        default: "p-4 sm:p-6",
        sm: "p-3 sm:p-4",
        lg: "p-6 sm:p-8",
        // Mobile-first responsive sizes
        mobile: "p-4",
        tablet: "p-4 sm:p-6",
        desktop: "p-6",
      },
      responsive: {
        true: "w-full",
        false: "",
      },
      hover: {
        true: "transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:bg-primary/5",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      responsive: true,
      hover: false,
    },
  }
)

const responsiveCardHeaderVariants = cva(
  "flex flex-col space-y-1.5",
  {
    variants: {
      size: {
        default: "pb-4 sm:pb-6",
        sm: "pb-3 sm:pb-4",
        lg: "pb-6 sm:pb-8",
        mobile: "pb-4",
        tablet: "pb-4 sm:pb-6",
        desktop: "pb-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const responsiveCardContentVariants = cva(
  "",
  {
    variants: {
      size: {
        default: "pt-0",
        sm: "pt-0",
        lg: "pt-0",
        mobile: "pt-0",
        tablet: "pt-0",
        desktop: "pt-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const responsiveCardFooterVariants = cva(
  "flex items-center",
  {
    variants: {
      size: {
        default: "pt-4 sm:pt-6",
        sm: "pt-3 sm:pt-4",
        lg: "pt-6 sm:pt-8",
        mobile: "pt-4",
        tablet: "pt-4 sm:pt-6",
        desktop: "pt-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface ResponsiveCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof responsiveCardVariants> {
  asChild?: boolean
}

const ResponsiveCard = React.forwardRef<HTMLDivElement, ResponsiveCardProps>(
  ({ className, variant, size, responsive, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(responsiveCardVariants({ variant, size, responsive, hover }), className)}
      {...props}
    />
  )
)
ResponsiveCard.displayName = "ResponsiveCard"

const ResponsiveCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof responsiveCardHeaderVariants>
>(({ className, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(responsiveCardHeaderVariants({ size }), className)}
    {...props}
  />
))
ResponsiveCardHeader.displayName = "ResponsiveCardHeader"

const ResponsiveCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg sm:text-xl lg:text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
ResponsiveCardTitle.displayName = "ResponsiveCardTitle"

const ResponsiveCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm sm:text-base text-muted-foreground", className)}
    {...props}
  />
))
ResponsiveCardDescription.displayName = "ResponsiveCardDescription"

const ResponsiveCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof responsiveCardContentVariants>
>(({ className, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(responsiveCardContentVariants({ size }), className)}
    {...props}
  />
))
ResponsiveCardContent.displayName = "ResponsiveCardContent"

const ResponsiveCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof responsiveCardFooterVariants>
>(({ className, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(responsiveCardFooterVariants({ size }), className)}
    {...props}
  />
))
ResponsiveCardFooter.displayName = "ResponsiveCardFooter"

// Predefined responsive card configurations
export const ResponsiveCardConfigs = {
  // Mobile-first cards
  mobile: {
    size: "mobile" as const,
    responsive: true,
    hover: false,
  },
  
  // Tablet cards
  tablet: {
    size: "tablet" as const,
    responsive: true,
    hover: true,
  },
  
  // Desktop cards
  desktop: {
    size: "desktop" as const,
    responsive: true,
    hover: true,
  },
  
  // Interactive cards
  interactive: {
    size: "default" as const,
    responsive: true,
    hover: true,
    variant: "interactive" as const,
  },
  
  // Compact cards
  compact: {
    size: "sm" as const,
    responsive: true,
    hover: false,
  },
  
  // Large cards
  large: {
    size: "lg" as const,
    responsive: true,
    hover: true,
  },
}

export {
  ResponsiveCard,
  ResponsiveCardHeader,
  ResponsiveCardFooter,
  ResponsiveCardTitle,
  ResponsiveCardDescription,
  ResponsiveCardContent,
} 