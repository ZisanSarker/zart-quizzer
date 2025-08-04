import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const responsiveHeadingVariants = cva(
  "font-bold tracking-tight",
  {
    variants: {
      variant: {
        default: "",
        gradient: "bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent",
        muted: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
      },
      size: {
        default: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
        sm: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
        lg: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
        // Mobile-first responsive sizes
        mobile: "text-2xl sm:text-3xl",
        tablet: "text-3xl sm:text-4xl md:text-5xl",
        desktop: "text-4xl sm:text-5xl lg:text-6xl",
        hero: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
        black: "font-black",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "bold",
    },
  }
)

const responsiveTextVariants = cva(
  "leading-relaxed",
  {
    variants: {
      variant: {
        default: "",
        muted: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        destructive: "text-destructive",
      },
      size: {
        default: "text-sm sm:text-base md:text-lg",
        sm: "text-xs sm:text-sm md:text-base",
        lg: "text-base sm:text-lg md:text-xl",
        xl: "text-lg sm:text-xl md:text-2xl",
        // Mobile-first responsive sizes
        mobile: "text-sm sm:text-base",
        tablet: "text-base sm:text-lg",
        desktop: "text-lg sm:text-xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "normal",
    },
  }
)

const responsiveParagraphVariants = cva(
  "leading-relaxed",
  {
    variants: {
      variant: {
        default: "",
        muted: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
      },
      size: {
        default: "text-sm sm:text-base md:text-lg",
        sm: "text-xs sm:text-sm md:text-base",
        lg: "text-base sm:text-lg md:text-xl",
        xl: "text-lg sm:text-xl md:text-2xl",
        // Mobile-first responsive sizes
        mobile: "text-sm sm:text-base",
        tablet: "text-base sm:text-lg",
        desktop: "text-lg sm:text-xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "normal",
    },
  }
)

const responsiveLabelVariants = cva(
  "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "",
        muted: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
        // Mobile-first responsive sizes
        mobile: "text-base",
        tablet: "text-sm",
        desktop: "text-sm",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "medium",
    },
  }
)

const responsiveCodeVariants = cva(
  "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
  {
    variants: {
      variant: {
        default: "",
        muted: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
        // Mobile-first responsive sizes
        mobile: "text-sm",
        tablet: "text-sm",
        desktop: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ResponsiveHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof responsiveHeadingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const ResponsiveHeading = React.forwardRef<HTMLHeadingElement, ResponsiveHeadingProps>(
  ({ className, variant, size, weight, as: Component = "h1", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(responsiveHeadingVariants({ variant, size, weight }), className)}
      {...props}
    />
  )
)
ResponsiveHeading.displayName = "ResponsiveHeading"

export interface ResponsiveTextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof responsiveTextVariants> {
  as?: "span" | "div" | "p"
}

const ResponsiveText = React.forwardRef<HTMLSpanElement, ResponsiveTextProps>(
  ({ className, variant, size, weight, as: Component = "span", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(responsiveTextVariants({ variant, size, weight }), className)}
      {...props}
    />
  )
)
ResponsiveText.displayName = "ResponsiveText"

export interface ResponsiveParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof responsiveParagraphVariants> {}

const ResponsiveParagraph = React.forwardRef<HTMLParagraphElement, ResponsiveParagraphProps>(
  ({ className, variant, size, weight, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(responsiveParagraphVariants({ variant, size, weight }), className)}
      {...props}
    />
  )
)
ResponsiveParagraph.displayName = "ResponsiveParagraph"

export interface ResponsiveLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof responsiveLabelVariants> {}

const ResponsiveLabel = React.forwardRef<HTMLLabelElement, ResponsiveLabelProps>(
  ({ className, variant, size, weight, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(responsiveLabelVariants({ variant, size, weight }), className)}
      {...props}
    />
  )
)
ResponsiveLabel.displayName = "ResponsiveLabel"

export interface ResponsiveCodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof responsiveCodeVariants> {}

const ResponsiveCode = React.forwardRef<HTMLElement, ResponsiveCodeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(responsiveCodeVariants({ variant, size }), className)}
      {...props}
    />
  )
)
ResponsiveCode.displayName = "ResponsiveCode"

// Predefined responsive typography configurations
export const ResponsiveTypographyConfigs = {
  // Mobile-first headings
  mobile: {
    variant: "default" as const,
    size: "mobile" as const,
    weight: "bold" as const,
  },
  
  // Tablet headings
  tablet: {
    variant: "default" as const,
    size: "tablet" as const,
    weight: "bold" as const,
  },
  
  // Desktop headings
  desktop: {
    variant: "default" as const,
    size: "desktop" as const,
    weight: "bold" as const,
  },
  
  // Hero headings
  hero: {
    variant: "gradient" as const,
    size: "hero" as const,
    weight: "bold" as const,
  },
  
  // Muted headings
  muted: {
    variant: "muted" as const,
    size: "default" as const,
    weight: "semibold" as const,
  },
  
  // Primary headings
  primary: {
    variant: "primary" as const,
    size: "default" as const,
    weight: "bold" as const,
  },
}

export {
  ResponsiveHeading,
  ResponsiveText,
  ResponsiveParagraph,
  ResponsiveLabel,
  ResponsiveCode,
} 