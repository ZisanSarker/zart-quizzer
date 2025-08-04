import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"
import { Button } from "./button"
import { X } from "lucide-react"

const responsiveModalVariants = cva(
  "relative bg-background text-foreground shadow-lg",
  {
    variants: {
      variant: {
        default: "rounded-lg border",
        fullscreen: "rounded-none border-0",
        card: "rounded-lg border shadow-lg",
        elevated: "rounded-lg border shadow-xl",
      },
      size: {
        default: "w-full max-w-lg",
        sm: "w-full max-w-sm",
        lg: "w-full max-w-2xl",
        xl: "w-full max-w-4xl",
        full: "w-full h-full max-w-none max-h-none",
        // Mobile-first responsive sizes
        mobile: "w-full max-w-sm mx-4",
        tablet: "w-full max-w-lg mx-4",
        desktop: "w-full max-w-2xl mx-4",
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

const responsiveModalHeaderVariants = cva(
  "flex flex-col space-y-1.5 text-center sm:text-left",
  {
    variants: {
      size: {
        default: "pb-4",
        sm: "pb-3",
        lg: "pb-6",
        mobile: "pb-4",
        tablet: "pb-4",
        desktop: "pb-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const responsiveModalTitleVariants = cva(
  "text-lg font-semibold leading-none tracking-tight",
  {
    variants: {
      size: {
        default: "",
        sm: "text-base",
        lg: "text-xl",
        mobile: "text-lg",
        tablet: "text-lg",
        desktop: "text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const responsiveModalDescriptionVariants = cva(
  "text-sm text-muted-foreground",
  {
    variants: {
      size: {
        default: "",
        sm: "text-xs",
        lg: "text-base",
        mobile: "text-sm",
        tablet: "text-sm",
        desktop: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const responsiveModalContentVariants = cva(
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

const responsiveModalFooterVariants = cva(
  "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
  {
    variants: {
      size: {
        default: "pt-4",
        sm: "pt-3",
        lg: "pt-6",
        mobile: "pt-4",
        tablet: "pt-4",
        desktop: "pt-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface ResponsiveModalProps
  extends React.ComponentPropsWithoutRef<typeof Dialog>,
    VariantProps<typeof responsiveModalVariants> {
  children: React.ReactNode
  title?: string
  description?: string
  footer?: React.ReactNode
  onClose?: () => void
  showCloseButton?: boolean
  fullscreenOnMobile?: boolean
}

const ResponsiveModal = React.forwardRef<
  React.ElementRef<typeof Dialog>,
  ResponsiveModalProps
>(({ 
  className, 
  variant, 
  size, 
  responsive, 
  children, 
  title, 
  description, 
  footer, 
  onClose, 
  showCloseButton = true,
  fullscreenOnMobile = false,
  ...props 
}, ref) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const shouldBeFullscreen = fullscreenOnMobile && isMobile

  return (
    <Dialog ref={ref} {...props}>
      <DialogContent 
        className={cn(
          responsiveModalVariants({ 
            variant: shouldBeFullscreen ? "fullscreen" : variant, 
            size: shouldBeFullscreen ? "full" : size, 
            responsive 
          }),
          className
        )}
      >
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 touch-target"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}

        {(title || description) && (
          <DialogHeader className={cn(responsiveModalHeaderVariants({ size }))}>
            {title && (
              <DialogTitle className={cn(responsiveModalTitleVariants({ size }))}>
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className={cn(responsiveModalDescriptionVariants({ size }))}>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className={cn(responsiveModalContentVariants({ size }))}>
          {children}
        </div>

        {footer && (
          <DialogFooter className={cn(responsiveModalFooterVariants({ size }))}>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
})
ResponsiveModal.displayName = "ResponsiveModal"

// Predefined responsive modal configurations
export const ResponsiveModalConfigs = {
  // Mobile-first modals
  mobile: {
    variant: "default" as const,
    size: "mobile" as const,
    responsive: true,
    fullscreenOnMobile: true,
  },
  
  // Tablet modals
  tablet: {
    variant: "default" as const,
    size: "tablet" as const,
    responsive: true,
    fullscreenOnMobile: false,
  },
  
  // Desktop modals
  desktop: {
    variant: "default" as const,
    size: "desktop" as const,
    responsive: true,
    fullscreenOnMobile: false,
  },
  
  // Fullscreen modals
  fullscreen: {
    variant: "fullscreen" as const,
    size: "full" as const,
    responsive: true,
    fullscreenOnMobile: true,
  },
  
  // Card modals
  card: {
    variant: "card" as const,
    size: "default" as const,
    responsive: true,
    fullscreenOnMobile: false,
  },
  
  // Elevated modals
  elevated: {
    variant: "elevated" as const,
    size: "default" as const,
    responsive: true,
    fullscreenOnMobile: false,
  },
}

export { ResponsiveModal } 