"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveFormProps {
  children: React.ReactNode
  className?: string
  onSubmit?: (e: React.FormEvent) => void
  method?: "GET" | "POST"
  action?: string
}

export function ResponsiveForm({
  children,
  className,
  onSubmit,
  method = "POST",
  action,
  ...props
}: ResponsiveFormProps) {
  return (
    <form
      className={cn(
        "space-y-4 sm:space-y-6",
        className
      )}
      onSubmit={onSubmit}
      method={method}
      action={action}
      {...props}
    >
      {children}
    </form>
  )
}

interface ResponsiveFormFieldProps {
  children: React.ReactNode
  className?: string
  label?: string
  error?: string
  required?: boolean
  helperText?: string
}

export function ResponsiveFormField({
  children,
  className,
  label,
  error,
  required = false,
  helperText,
}: ResponsiveFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

interface ResponsiveInputProps {
  className?: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
  step?: number
  pattern?: string
  autoComplete?: string
  autoFocus?: boolean
  id?: string
  name?: string
}

export function ResponsiveInput({
  className,
  placeholder,
  type = "text",
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  min,
  max,
  step,
  pattern,
  autoComplete,
  autoFocus = false,
  id,
  name,
  ...props
}: ResponsiveInputProps) {
  return (
    <input
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "min-h-[44px] sm:min-h-[40px]", // Better touch targets on mobile
        className
      )}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      required={required}
      min={min}
      max={max}
      step={step}
      pattern={pattern}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      id={id}
      name={name}
      {...props}
    />
  )
}

interface ResponsiveTextareaProps {
  className?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
  required?: boolean
  rows?: number
  autoComplete?: string
  autoFocus?: boolean
  id?: string
  name?: string
}

export function ResponsiveTextarea({
  className,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  rows = 4,
  autoComplete,
  autoFocus = false,
  id,
  name,
  ...props
}: ResponsiveTextareaProps) {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "min-h-[44px] sm:min-h-[40px]", // Better touch targets on mobile
        className
      )}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      required={required}
      rows={rows}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      id={id}
      name={name}
      {...props}
    />
  )
}

interface ResponsiveSelectProps {
  children: React.ReactNode
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
  disabled?: boolean
  required?: boolean
  autoComplete?: string
  autoFocus?: boolean
  id?: string
  name?: string
}

export function ResponsiveSelect({
  children,
  className,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  autoComplete,
  autoFocus = false,
  id,
  name,
  ...props
}: ResponsiveSelectProps) {
  return (
    <select
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "min-h-[44px] sm:min-h-[40px]", // Better touch targets on mobile
        className
      )}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      id={id}
      name={name}
      {...props}
    >
      {children}
    </select>
  )
}

interface ResponsiveButtonGroupProps {
  children: React.ReactNode
  className?: string
  direction?: "row" | "col"
  responsiveDirection?: {
    default: "row" | "col"
    sm?: "row" | "col"
    md?: "row" | "col"
    lg?: "row" | "col"
  }
  gap?: string
}

export function ResponsiveButtonGroup({
  children,
  className,
  direction = "row",
  responsiveDirection,
  gap = "gap-3 sm:gap-4",
}: ResponsiveButtonGroupProps) {
  const getDirectionClasses = () => {
    if (responsiveDirection) {
      const classes = []
      classes.push(`flex-${responsiveDirection.default}`)
      if (responsiveDirection.sm) classes.push(`sm:flex-${responsiveDirection.sm}`)
      if (responsiveDirection.md) classes.push(`md:flex-${responsiveDirection.md}`)
      if (responsiveDirection.lg) classes.push(`lg:flex-${responsiveDirection.lg}`)
      return classes.join(" ")
    }
    return `flex-${direction}`
  }

  return (
    <div
      className={cn(
        "flex",
        getDirectionClasses(),
        gap,
        className
      )}
    >
      {children}
    </div>
  )
}

interface ResponsiveFormSectionProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
}

export function ResponsiveFormSection({
  children,
  className,
  title,
  description,
}: ResponsiveFormSectionProps) {
  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// Predefined responsive form layouts
export const ResponsiveFormLayouts = {
  // Single column layout
  single: {
    className: "max-w-md mx-auto",
  },
  
  // Two column layout
  twoColumn: {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6",
  },
  
  // Three column layout
  threeColumn: {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
  },
  
  // Full width layout
  fullWidth: {
    className: "w-full",
  },
  
  // Centered layout
  centered: {
    className: "max-w-2xl mx-auto",
  },
  
  // Wide layout
  wide: {
    className: "max-w-4xl mx-auto",
  },
} 