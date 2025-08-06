"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ResponsiveModalProps {
  children: React.ReactNode
  trigger?: React.ReactNode
  title?: string
  description?: string
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showCloseButton?: boolean
  onClose?: () => void
}

export function ResponsiveModal({
  children,
  trigger,
  title,
  description,
  className,
  open,
  onOpenChange,
  size = "md",
  showCloseButton = true,
  onClose,
}: ResponsiveModalProps) {
  const sizeClasses = {
    sm: "w-full max-w-sm",
    md: "w-full max-w-md sm:max-w-lg",
    lg: "w-full max-w-lg sm:max-w-xl lg:max-w-2xl",
    xl: "w-full max-w-xl sm:max-w-2xl lg:max-w-4xl",
    full: "w-full h-full max-w-none max-h-none rounded-none",
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    if (onOpenChange) {
      onOpenChange(false)
    }
  }

  return (
    <>
      {/* Desktop Modal */}
      <div className="hidden md:block">
        <Dialog open={open} onOpenChange={onOpenChange}>
          {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
          <DialogContent className={cn(sizeClasses[size], className)}>
            {(title || description) && (
              <DialogHeader>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && <DialogDescription>{description}</DialogDescription>}
              </DialogHeader>
            )}
            <div className="relative">
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-8 w-8 p-0"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {children}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Sheet */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={onOpenChange}>
          {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
          <SheetContent side="bottom" className={cn("h-[90vh] w-full", className)}>
            {(title || description) && (
              <SheetHeader>
                {title && <SheetTitle>{title}</SheetTitle>}
                {description && <SheetDescription>{description}</SheetDescription>}
              </SheetHeader>
            )}
            <div className="relative flex-1 overflow-y-auto">
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-8 w-8 p-0"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {children}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

interface ResponsiveModalFooterProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveModalFooter({
  children,
  className,
}: ResponsiveModalFooterProps) {
  return (
    <>
      {/* Desktop Footer */}
      <div className="hidden md:block">
        <DialogFooter className={cn("flex flex-col sm:flex-row gap-2", className)}>
          {children}
        </DialogFooter>
      </div>

      {/* Mobile Footer */}
      <div className="md:hidden">
        <SheetFooter className={cn("flex flex-col gap-2 pt-4", className)}>
          {children}
        </SheetFooter>
      </div>
    </>
  )
}

interface ResponsiveModalButtonProps {
  children: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function ResponsiveModalButton({
  children,
  variant = "default",
  size = "default",
  className,
  onClick,
  disabled = false,
  type = "button",
}: ResponsiveModalButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "w-full sm:w-auto min-h-[44px] sm:min-h-[40px]", // Better touch targets on mobile
        className
      )}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </Button>
  )
}

interface ResponsiveModalContentProps {
  children: React.ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
}

export function ResponsiveModalContent({
  children,
  className,
  padding = "md",
}: ResponsiveModalContentProps) {
  const paddingClasses = {
    none: "",
    sm: "p-2 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  }

  return (
    <div className={cn(paddingClasses[padding], className)}>
      {children}
    </div>
  )
}

// Predefined responsive modal layouts
export const ResponsiveModalLayouts = {
  // Small modal
  small: {
    size: "sm" as const,
    className: "max-w-sm",
  },
  
  // Medium modal
  medium: {
    size: "md" as const,
    className: "max-w-md sm:max-w-lg",
  },
  
  // Large modal
  large: {
    size: "lg" as const,
    className: "max-w-lg sm:max-w-xl lg:max-w-2xl",
  },
  
  // Extra large modal
  extraLarge: {
    size: "xl" as const,
    className: "max-w-xl sm:max-w-2xl lg:max-w-4xl",
  },
  
  // Full screen modal
  fullScreen: {
    size: "full" as const,
    className: "w-full h-full max-w-none max-h-none rounded-none",
  },
} 