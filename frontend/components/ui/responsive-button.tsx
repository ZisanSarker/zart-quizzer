import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const responsiveButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // Mobile-first responsive sizes
        mobile: "h-12 px-4 py-3 text-base",
        tablet: "h-10 px-4 py-2 text-sm",
        desktop: "h-9 px-3 py-2 text-sm",
      },
      responsive: {
        true: "w-full sm:w-auto",
        false: "",
      },
      touch: {
        true: "min-h-[44px] min-w-[44px]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      responsive: false,
      touch: false,
    },
  }
)

export interface ResponsiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof responsiveButtonVariants> {
  asChild?: boolean
  fullWidth?: boolean
  touchTarget?: boolean
}

const ResponsiveButton = React.forwardRef<HTMLButtonElement, ResponsiveButtonProps>(
  ({ className, variant, size, responsive, touch, fullWidth, touchTarget, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Determine responsive behavior
    const isResponsive = responsive || fullWidth
    const isTouchTarget = touch || touchTarget

    return (
      <Comp
        className={cn(
          responsiveButtonVariants({ 
            variant, 
            size, 
            responsive: isResponsive, 
            touch: isTouchTarget 
          }),
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
ResponsiveButton.displayName = "ResponsiveButton"

// Predefined responsive button configurations
export const ResponsiveButtonConfigs = {
  // Mobile-first buttons
  mobile: {
    size: "mobile" as const,
    responsive: true,
    touch: true,
  },
  
  // Tablet buttons
  tablet: {
    size: "tablet" as const,
    responsive: true,
    touch: true,
  },
  
  // Desktop buttons
  desktop: {
    size: "desktop" as const,
    responsive: false,
    touch: false,
  },
  
  // Full-width mobile buttons
  fullWidth: {
    size: "mobile" as const,
    responsive: true,
    touch: true,
  },
  
  // Icon buttons with touch targets
  iconTouch: {
    size: "icon" as const,
    responsive: false,
    touch: true,
  },
  
  // Standard responsive buttons
  standard: {
    size: "default" as const,
    responsive: true,
    touch: true,
  },
}

export { ResponsiveButton, responsiveButtonVariants } 