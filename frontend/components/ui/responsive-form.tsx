import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Checkbox } from "./checkbox"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Button } from "./button"

const responsiveFormVariants = cva(
  "space-y-4 sm:space-y-6",
  {
    variants: {
      variant: {
        default: "",
        compact: "space-y-3 sm:space-y-4",
        spacious: "space-y-6 sm:space-y-8",
      },
      size: {
        default: "",
        sm: "space-y-2 sm:space-y-3",
        lg: "space-y-6 sm:space-y-8",
        // Mobile-first responsive sizes
        mobile: "space-y-4",
        tablet: "space-y-4 sm:space-y-6",
        desktop: "space-y-6",
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

const responsiveFormFieldVariants = cva(
  "space-y-2",
  {
    variants: {
      variant: {
        default: "",
        compact: "space-y-1",
        spacious: "space-y-3",
      },
      size: {
        default: "",
        sm: "space-y-1",
        lg: "space-y-3",
        mobile: "space-y-2",
        tablet: "space-y-2",
        desktop: "space-y-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const responsiveFormLabelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      size: {
        default: "",
        sm: "text-xs",
        lg: "text-base",
        mobile: "text-base",
        tablet: "text-sm",
        desktop: "text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const responsiveFormInputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
        mobile: "h-12 px-4 py-3 text-base",
        tablet: "h-10 px-3 py-2 text-sm",
        desktop: "h-9 px-3 py-2 text-sm",
      },
      responsive: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      responsive: true,
    },
  }
)

const responsiveFormTextareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "",
        sm: "min-h-[60px] px-2 py-1 text-xs",
        lg: "min-h-[120px] px-4 py-3 text-base",
        mobile: "min-h-[100px] px-4 py-3 text-base",
        tablet: "min-h-[80px] px-3 py-2 text-sm",
        desktop: "min-h-[80px] px-3 py-2 text-sm",
      },
      responsive: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      responsive: true,
    },
  }
)

const responsiveFormButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        mobile: "h-12 px-4 py-3 text-base w-full",
        tablet: "h-10 px-4 py-2 text-sm w-full sm:w-auto",
        desktop: "h-9 px-3 py-2 text-sm",
      },
      responsive: {
        true: "w-full sm:w-auto",
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

export interface ResponsiveFormProps
  extends React.FormHTMLAttributes<HTMLFormElement>,
    VariantProps<typeof responsiveFormVariants> {
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

const ResponsiveForm = React.forwardRef<HTMLFormElement, ResponsiveFormProps>(
  ({ className, variant, size, responsive, children, onSubmit, ...props }, ref) => (
    <form
      ref={ref}
      className={cn(responsiveFormVariants({ variant, size, responsive }), className)}
      onSubmit={onSubmit}
      {...props}
    >
      {children}
    </form>
  )
)
ResponsiveForm.displayName = "ResponsiveForm"

const ResponsiveFormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof responsiveFormFieldVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(responsiveFormFieldVariants({ variant, size }), className)}
    {...props}
  />
))
ResponsiveFormField.displayName = "ResponsiveFormField"

const ResponsiveFormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label> & VariantProps<typeof responsiveFormLabelVariants>
>(({ className, size, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn(responsiveFormLabelVariants({ size }), className)}
    {...props}
  />
))
ResponsiveFormLabel.displayName = "ResponsiveFormLabel"

const ResponsiveFormInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentPropsWithoutRef<typeof Input> & VariantProps<typeof responsiveFormInputVariants>
>(({ className, size, responsive, ...props }, ref) => (
  <Input
    ref={ref}
    className={cn(responsiveFormInputVariants({ size, responsive }), className)}
    {...props}
  />
))
ResponsiveFormInput.displayName = "ResponsiveFormInput"

const ResponsiveFormTextarea = React.forwardRef<
  React.ElementRef<typeof Textarea>,
  React.ComponentPropsWithoutRef<typeof Textarea> & VariantProps<typeof responsiveFormTextareaVariants>
>(({ className, size, responsive, ...props }, ref) => (
  <Textarea
    ref={ref}
    className={cn(responsiveFormTextareaVariants({ size, responsive }), className)}
    {...props}
  />
))
ResponsiveFormTextarea.displayName = "ResponsiveFormTextarea"

const ResponsiveFormSelect = React.forwardRef<
  React.ElementRef<typeof Select>,
  React.ComponentPropsWithoutRef<typeof Select>
>(({ className, ...props }, ref) => (
  <Select ref={ref} className={cn("w-full", className)} {...props} />
))
ResponsiveFormSelect.displayName = "ResponsiveFormSelect"

const ResponsiveFormButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & VariantProps<typeof responsiveFormButtonVariants>
>(({ className, variant, size, responsive, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn(responsiveFormButtonVariants({ variant, size, responsive }), className)}
    {...props}
  />
))
ResponsiveFormButton.displayName = "ResponsiveFormButton"

// Predefined responsive form configurations
export const ResponsiveFormConfigs = {
  // Mobile-first forms
  mobile: {
    variant: "default" as const,
    size: "mobile" as const,
    responsive: true,
  },
  
  // Tablet forms
  tablet: {
    variant: "default" as const,
    size: "tablet" as const,
    responsive: true,
  },
  
  // Desktop forms
  desktop: {
    variant: "default" as const,
    size: "desktop" as const,
    responsive: true,
  },
  
  // Compact forms
  compact: {
    variant: "compact" as const,
    size: "sm" as const,
    responsive: true,
  },
  
  // Spacious forms
  spacious: {
    variant: "spacious" as const,
    size: "lg" as const,
    responsive: true,
  },
}

export {
  ResponsiveForm,
  ResponsiveFormField,
  ResponsiveFormLabel,
  ResponsiveFormInput,
  ResponsiveFormTextarea,
  ResponsiveFormSelect,
  ResponsiveFormButton,
} 