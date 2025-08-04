import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Menu, X } from "lucide-react"

const responsiveNavigationVariants = cva(
  "flex items-center justify-between w-full",
  {
    variants: {
      variant: {
        default: "bg-background border-b",
        transparent: "bg-transparent",
        elevated: "bg-background/80 backdrop-blur-sm border-b",
      },
      size: {
        default: "h-14 sm:h-16 px-3 sm:px-4 lg:px-6",
        sm: "h-12 px-3 sm:px-4",
        lg: "h-16 sm:h-20 px-4 sm:px-6 lg:px-8",
      },
      responsive: {
        true: "sticky top-0 z-50",
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

const responsiveNavigationMenuVariants = cva(
  "flex items-center gap-2 sm:gap-4 lg:gap-6",
  {
    variants: {
      variant: {
        default: "",
        mobile: "flex-col items-start w-full space-y-2",
        tablet: "flex-row items-center gap-2 sm:gap-4",
      },
      size: {
        default: "",
        sm: "gap-1 sm:gap-2",
        lg: "gap-3 sm:gap-4 lg:gap-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const responsiveNavigationItemVariants = cva(
  "flex items-center gap-1 px-3 py-2 rounded-md font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        active: "bg-primary text-primary-foreground",
        mobile: "w-full justify-start py-3 px-4",
        tablet: "px-3 py-2",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
        mobile: "text-base",
        tablet: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ResponsiveNavigationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof responsiveNavigationVariants> {
  children: React.ReactNode
  logo?: React.ReactNode
  actions?: React.ReactNode
  mobileMenu?: React.ReactNode
  onMobileMenuToggle?: (open: boolean) => void
}

const ResponsiveNavigation = React.forwardRef<HTMLElement, ResponsiveNavigationProps>(
  ({ 
    className, 
    variant, 
    size, 
    responsive, 
    children, 
    logo, 
    actions, 
    mobileMenu,
    onMobileMenuToggle,
    ...props 
  }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    const handleMobileMenuToggle = () => {
      const newState = !isMobileMenuOpen
      setIsMobileMenuOpen(newState)
      onMobileMenuToggle?.(newState)
    }

    return (
      <nav
        ref={ref}
        className={cn(responsiveNavigationVariants({ variant, size, responsive }), className)}
        {...props}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Logo */}
          {logo && (
            <div className="flex items-center">
              {logo}
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-6">
            {children}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2 sm:gap-4">
              {actions}
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden touch-target"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg z-50">
            <div className="p-4 space-y-2">
              {mobileMenu || children}
            </div>
          </div>
        )}
      </nav>
    )
  }
)
ResponsiveNavigation.displayName = "ResponsiveNavigation"

const ResponsiveNavigationMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof responsiveNavigationMenuVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(responsiveNavigationMenuVariants({ variant, size }), className)}
    {...props}
  />
))
ResponsiveNavigationMenu.displayName = "ResponsiveNavigationMenu"

const ResponsiveNavigationItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof responsiveNavigationItemVariants>
>(({ className, variant, size, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(responsiveNavigationItemVariants({ variant, size }), className)}
    {...props}
  />
))
ResponsiveNavigationItem.displayName = "ResponsiveNavigationItem"

// Predefined responsive navigation configurations
export const ResponsiveNavigationConfigs = {
  // Mobile-first navigation
  mobile: {
    variant: "default" as const,
    size: "default" as const,
    responsive: true,
  },
  
  // Tablet navigation
  tablet: {
    variant: "default" as const,
    size: "default" as const,
    responsive: true,
  },
  
  // Desktop navigation
  desktop: {
    variant: "default" as const,
    size: "default" as const,
    responsive: true,
  },
  
  // Transparent navigation
  transparent: {
    variant: "transparent" as const,
    size: "default" as const,
    responsive: true,
  },
  
  // Elevated navigation
  elevated: {
    variant: "elevated" as const,
    size: "default" as const,
    responsive: true,
  },
}

export {
  ResponsiveNavigation,
  ResponsiveNavigationMenu,
  ResponsiveNavigationItem,
} 