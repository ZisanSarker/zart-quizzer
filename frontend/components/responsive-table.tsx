"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveTableProps {
  children: React.ReactNode
  className?: string
  mobileLayout?: "scroll" | "cards" | "stack"
}

export function ResponsiveTable({
  children,
  className,
  mobileLayout = "scroll",
}: ResponsiveTableProps) {
  if (mobileLayout === "cards") {
    return (
      <>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className={cn("overflow-x-auto", className)}>
            {children}
          </div>
        </div>
        
        {/* Mobile Cards */}
        <div className="md:hidden">
          <div className="space-y-4">
            {/* This will be populated by ResponsiveTableRow components */}
            {children}
          </div>
        </div>
      </>
    )
  }

  if (mobileLayout === "stack") {
    return (
      <>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className={cn("overflow-x-auto", className)}>
            {children}
          </div>
        </div>
        
        {/* Mobile Stack */}
        <div className="md:hidden">
          <div className="space-y-2">
            {children}
          </div>
        </div>
      </>
    )
  }

  // Default scroll layout
  return (
    <div className={cn("overflow-x-auto", className)}>
      {children}
    </div>
  )
}

interface ResponsiveTableHeaderProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveTableHeader({
  children,
  className,
}: ResponsiveTableHeaderProps) {
  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block">
        <thead className={className}>
          {children}
        </thead>
      </div>
    </>
  )
}

interface ResponsiveTableBodyProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveTableBody({
  children,
  className,
}: ResponsiveTableBodyProps) {
  return (
    <>
      {/* Desktop Body */}
      <div className="hidden md:block">
        <tbody className={className}>
          {children}
        </tbody>
      </div>
      
      {/* Mobile Body */}
      <div className="md:hidden">
        {children}
      </div>
    </>
  )
}

interface ResponsiveTableRowProps {
  children: React.ReactNode
  className?: string
  mobileData?: Array<{ label: string; value: React.ReactNode }>
  mobileTitle?: string
  mobileSubtitle?: string
  mobileActions?: React.ReactNode
}

export function ResponsiveTableRow({
  children,
  className,
  mobileData,
  mobileTitle,
  mobileSubtitle,
  mobileActions,
}: ResponsiveTableRowProps) {
  return (
    <>
      {/* Desktop Row */}
      <div className="hidden md:block">
        <tr className={cn("border-b transition-colors hover:bg-muted/50", className)}>
          {children}
        </tr>
      </div>
      
      {/* Mobile Card/Stack */}
      <div className="md:hidden">
        <div className={cn("border rounded-lg p-4 space-y-3", className)}>
          {/* Mobile Header */}
          {(mobileTitle || mobileSubtitle) && (
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {mobileTitle && (
                  <h3 className="font-semibold text-foreground truncate">
                    {mobileTitle}
                  </h3>
                )}
                {mobileSubtitle && (
                  <p className="text-sm text-muted-foreground truncate">
                    {mobileSubtitle}
                  </p>
                )}
              </div>
              {mobileActions && (
                <div className="flex-shrink-0 ml-2">
                  {mobileActions}
                </div>
              )}
            </div>
          )}
          
          {/* Mobile Data */}
          {mobileData && (
            <div className="space-y-2">
              {mobileData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Fallback to children if no mobileData */}
          {!mobileData && children}
        </div>
      </div>
    </>
  )
}

interface ResponsiveTableCellProps {
  children: React.ReactNode
  className?: string
  align?: "left" | "center" | "right"
  mobileLabel?: string
}

export function ResponsiveTableCell({
  children,
  className,
  align = "left",
  mobileLabel,
}: ResponsiveTableCellProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <>
      {/* Desktop Cell */}
      <div className="hidden md:block">
        <td className={cn("p-4", alignClasses[align], className)}>
          {children}
        </td>
      </div>
      
      {/* Mobile Cell */}
      <div className="md:hidden">
        <div className={cn("flex justify-between items-center py-2", className)}>
          {mobileLabel && (
            <span className="text-sm font-medium text-muted-foreground">
              {mobileLabel}
            </span>
          )}
          <span className={cn("text-sm", alignClasses[align])}>
            {children}
          </span>
        </div>
      </div>
    </>
  )
}

interface ResponsiveTableHeaderCellProps {
  children: React.ReactNode
  className?: string
  align?: "left" | "center" | "right"
}

export function ResponsiveTableHeaderCell({
  children,
  className,
  align = "left",
}: ResponsiveTableHeaderCellProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <th className={cn("p-4 font-semibold text-foreground", alignClasses[align], className)}>
      {children}
    </th>
  )
}

interface ResponsiveTableContainerProps {
  children: React.ReactNode
  className?: string
  maxHeight?: string
}

export function ResponsiveTableContainer({
  children,
  className,
  maxHeight = "max-h-96",
}: ResponsiveTableContainerProps) {
  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className={cn("overflow-y-auto", maxHeight)}>
        <table className="w-full">
          {children}
        </table>
      </div>
    </div>
  )
}

interface ResponsiveTableEmptyProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveTableEmpty({
  children,
  className,
}: ResponsiveTableEmptyProps) {
  return (
    <div className={cn("text-center py-8 text-muted-foreground", className)}>
      {children}
    </div>
  )
}

// Predefined responsive table layouts
export const ResponsiveTableLayouts = {
  // Standard table with horizontal scroll on mobile
  standard: {
    mobileLayout: "scroll" as const,
  },
  
  // Card-based layout on mobile
  cards: {
    mobileLayout: "cards" as const,
  },
  
  // Stack layout on mobile
  stack: {
    mobileLayout: "stack" as const,
  },
  
  // Compact table
  compact: {
    className: "text-sm",
    mobileLayout: "cards" as const,
  },
  
  // Wide table
  wide: {
    className: "min-w-full",
    mobileLayout: "scroll" as const,
  },
} 