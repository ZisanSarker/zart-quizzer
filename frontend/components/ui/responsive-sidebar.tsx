import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./sheet"

const responsiveSidebarVariants = cva(
  "flex flex-col bg-sidebar text-sidebar-foreground",
  {
    variants: {
      variant: {
        default: "border-r border-sidebar-border",
        floating: "rounded-lg border shadow-lg",
        inset: "bg-background",
      },
      size: {
        default: "w-64",
        sm: "w-48",
        lg: "w-80",
        // Mobile-first responsive sizes
        mobile: "w-full max-w-sm",
        tablet: "w-64",
        desktop: "w-64",
      },
      responsive: {
        true: "h-full",
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

const responsiveSidebarHeaderVariants = cva(
  "flex items-center justify-between p-4 border-b border-sidebar-border",
  {
    variants: {
      size: {
        default: "",
        sm: "p-3",
        lg: "p-6",
        mobile: "p-4",
        tablet: "p-4",
        desktop: "p-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const responsiveSidebarContentVariants = cva(
  "flex-1 overflow-auto",
  {
    variants: {
      size: {
        default: "p-4",
        sm: "p-3",
        lg: "p-6",
        mobile: "p-4",
        tablet: "p-4",
        desktop: "p-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const responsiveSidebarFooterVariants = cva(
  "flex items-center justify-between p-4 border-t border-sidebar-border",
  {
    variants: {
      size: {
        default: "",
        sm: "p-3",
        lg: "p-6",
        mobile: "p-4",
        tablet: "p-4",
        desktop: "p-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const responsiveSidebarItemVariants = cva(
  "flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active: "bg-sidebar-accent text-sidebar-accent-foreground",
        mobile: "w-full justify-start py-3 px-4",
        tablet: "px-3 py-2",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
        mobile: "text-base",
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

export interface ResponsiveSidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof responsiveSidebarVariants> {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  trigger?: React.ReactNode
  onOpenChange?: (open: boolean) => void
  mobileBehavior?: "sheet" | "overlay" | "none"
}

const ResponsiveSidebar = React.forwardRef<HTMLDivElement, ResponsiveSidebarProps>(
  ({ 
    className, 
    variant, 
    size, 
    responsive, 
    children, 
    header, 
    footer, 
    trigger,
    onOpenChange,
    mobileBehavior = "sheet",
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open)
      onOpenChange?.(open)
    }

    if (isMobile && mobileBehavior === "sheet") {
      return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            {trigger || (
              <Button variant="ghost" size="icon" className="touch-target">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            )}
          </SheetTrigger>
          <SheetContent
            side="left"
            className={cn(
              responsiveSidebarVariants({ variant, size, responsive }),
              "p-0"
            )}
          >
            <div className="flex h-full flex-col">
              {header && (
                <div className={cn(responsiveSidebarHeaderVariants({ size }))}>
                  {header}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="touch-target"
                    onClick={() => handleOpenChange(false)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close sidebar</span>
                  </Button>
                </div>
              )}
              <div className={cn(responsiveSidebarContentVariants({ size }))}>
                {children}
              </div>
              {footer && (
                <div className={cn(responsiveSidebarFooterVariants({ size }))}>
                  {footer}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )
    }

    if (isMobile && mobileBehavior === "overlay") {
      return (
        <>
          {trigger && (
            <Button variant="ghost" size="icon" className="touch-target" onClick={() => handleOpenChange(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          {isOpen && (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/50" onClick={() => handleOpenChange(false)} />
              <div
                ref={ref}
                className={cn(
                  responsiveSidebarVariants({ variant, size, responsive }),
                  "absolute left-0 top-0 h-full",
                  className
                )}
                {...props}
              >
                <div className="flex h-full flex-col">
                  {header && (
                    <div className={cn(responsiveSidebarHeaderVariants({ size }))}>
                      {header}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="touch-target"
                        onClick={() => handleOpenChange(false)}
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close sidebar</span>
                      </Button>
                    </div>
                  )}
                  <div className={cn(responsiveSidebarContentVariants({ size }))}>
                    {children}
                  </div>
                  {footer && (
                    <div className={cn(responsiveSidebarFooterVariants({ size }))}>
                      {footer}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(responsiveSidebarVariants({ variant, size, responsive }), className)}
        {...props}
      >
        <div className="flex h-full flex-col">
          {header && (
            <div className={cn(responsiveSidebarHeaderVariants({ size }))}>
              {header}
            </div>
          )}
          <div className={cn(responsiveSidebarContentVariants({ size }))}>
            {children}
          </div>
          {footer && (
            <div className={cn(responsiveSidebarFooterVariants({ size }))}>
              {footer}
            </div>
          )}
        </div>
      </div>
    )
  }
)
ResponsiveSidebar.displayName = "ResponsiveSidebar"

const ResponsiveSidebarItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof responsiveSidebarItemVariants>
>(({ className, variant, size, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(responsiveSidebarItemVariants({ variant, size }), className)}
    {...props}
  />
))
ResponsiveSidebarItem.displayName = "ResponsiveSidebarItem"

// Predefined responsive sidebar configurations
export const ResponsiveSidebarConfigs = {
  // Mobile-first sidebar
  mobile: {
    variant: "default" as const,
    size: "mobile" as const,
    responsive: true,
    mobileBehavior: "sheet" as const,
  },
  
  // Tablet sidebar
  tablet: {
    variant: "default" as const,
    size: "tablet" as const,
    responsive: true,
    mobileBehavior: "sheet" as const,
  },
  
  // Desktop sidebar
  desktop: {
    variant: "default" as const,
    size: "desktop" as const,
    responsive: true,
    mobileBehavior: "none" as const,
  },
  
  // Floating sidebar
  floating: {
    variant: "floating" as const,
    size: "default" as const,
    responsive: true,
    mobileBehavior: "sheet" as const,
  },
  
  // Inset sidebar
  inset: {
    variant: "inset" as const,
    size: "default" as const,
    responsive: true,
    mobileBehavior: "sheet" as const,
  },
}

export {
  ResponsiveSidebar,
  ResponsiveSidebarItem,
} 