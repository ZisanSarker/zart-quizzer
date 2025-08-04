import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

const responsiveTableVariants = cva(
  "w-full caption-bottom text-sm",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border border-border",
        striped: "",
        compact: "",
      },
      size: {
        default: "",
        sm: "text-xs",
        lg: "text-base",
        // Mobile-first responsive sizes
        mobile: "text-sm",
        tablet: "text-sm",
        desktop: "text-sm",
      },
      responsive: {
        true: "overflow-x-auto",
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

const responsiveTableHeaderVariants = cva(
  "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-b border-border",
        striped: "",
        compact: "py-2",
      },
      size: {
        default: "",
        sm: "py-2",
        lg: "py-4",
        mobile: "py-3",
        tablet: "py-3",
        desktop: "py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const responsiveTableRowVariants = cva(
  "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-b border-border",
        striped: "even:bg-muted/50",
        compact: "py-2",
      },
      size: {
        default: "",
        sm: "py-2",
        lg: "py-4",
        mobile: "py-3",
        tablet: "py-3",
        desktop: "py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const responsiveTableCellVariants = cva(
  "p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-r border-border last:border-r-0",
        striped: "",
        compact: "p-2",
      },
      size: {
        default: "",
        sm: "p-2",
        lg: "p-6",
        mobile: "p-3",
        tablet: "p-4",
        desktop: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const responsiveTableHeaderCellVariants = cva(
  "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-r border-border last:border-r-0",
        striped: "",
        compact: "h-8 px-2",
      },
      size: {
        default: "",
        sm: "h-8 px-2",
        lg: "h-16 px-6",
        mobile: "h-12 px-3",
        tablet: "h-12 px-4",
        desktop: "h-12 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ResponsiveTableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof responsiveTableVariants> {
  children: React.ReactNode
  mobileView?: "stack" | "scroll" | "cards"
}

const ResponsiveTable = React.forwardRef<HTMLTableElement, ResponsiveTableProps>(
  ({ className, variant, size, responsive, children, mobileView = "scroll", ...props }, ref) => {
    if (mobileView === "stack" && typeof window !== 'undefined' && window.innerWidth < 768) {
      return (
        <div className="space-y-4">
          {/* Mobile stacked view */}
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === TableBody) {
              return React.cloneElement(child, {
                className: cn("space-y-4", child.props.className),
                children: React.Children.map(child.props.children, (row) => {
                  if (React.isValidElement(row) && row.type === TableRow) {
                    return (
                      <div key={row.key} className="border rounded-lg p-4 space-y-2">
                        {React.Children.map(row.props.children, (cell, index) => {
                          if (React.isValidElement(cell) && cell.type === TableCell) {
                            return (
                              <div key={index} className="flex justify-between items-center">
                                <span className="font-medium text-muted-foreground">
                                  {/* You might want to add header labels here */}
                                </span>
                                <span>{cell.props.children}</span>
                              </div>
                            )
                          }
                          return cell
                        })}
                      </div>
                    )
                  }
                  return row
                })
              })
            }
            return child
          })}
        </div>
      )
    }

    return (
      <div className={cn(responsive && "overflow-x-auto")}>
        <Table
          ref={ref}
          className={cn(responsiveTableVariants({ variant, size, responsive }), className)}
          {...props}
        >
          {children}
        </Table>
      </div>
    )
  }
)
ResponsiveTable.displayName = "ResponsiveTable"

const ResponsiveTableHeader = React.forwardRef<
  React.ElementRef<typeof TableHeader>,
  React.ComponentPropsWithoutRef<typeof TableHeader> & VariantProps<typeof responsiveTableHeaderVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TableHeader
    ref={ref}
    className={cn(responsiveTableHeaderVariants({ variant, size }), className)}
    {...props}
  />
))
ResponsiveTableHeader.displayName = "ResponsiveTableHeader"

const ResponsiveTableRow = React.forwardRef<
  React.ElementRef<typeof TableRow>,
  React.ComponentPropsWithoutRef<typeof TableRow> & VariantProps<typeof responsiveTableRowVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TableRow
    ref={ref}
    className={cn(responsiveTableRowVariants({ variant, size }), className)}
    {...props}
  />
))
ResponsiveTableRow.displayName = "ResponsiveTableRow"

const ResponsiveTableCell = React.forwardRef<
  React.ElementRef<typeof TableCell>,
  React.ComponentPropsWithoutRef<typeof TableCell> & VariantProps<typeof responsiveTableCellVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TableCell
    ref={ref}
    className={cn(responsiveTableCellVariants({ variant, size }), className)}
    {...props}
  />
))
ResponsiveTableCell.displayName = "ResponsiveTableCell"

const ResponsiveTableHeaderCell = React.forwardRef<
  React.ElementRef<typeof TableHead>,
  React.ComponentPropsWithoutRef<typeof TableHead> & VariantProps<typeof responsiveTableHeaderCellVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TableHead
    ref={ref}
    className={cn(responsiveTableHeaderCellVariants({ variant, size }), className)}
    {...props}
  />
))
ResponsiveTableHeaderCell.displayName = "ResponsiveTableHeaderCell"

// Predefined responsive table configurations
export const ResponsiveTableConfigs = {
  // Mobile-first tables
  mobile: {
    variant: "default" as const,
    size: "mobile" as const,
    responsive: true,
    mobileView: "stack" as const,
  },
  
  // Tablet tables
  tablet: {
    variant: "default" as const,
    size: "tablet" as const,
    responsive: true,
    mobileView: "scroll" as const,
  },
  
  // Desktop tables
  desktop: {
    variant: "default" as const,
    size: "desktop" as const,
    responsive: true,
    mobileView: "scroll" as const,
  },
  
  // Bordered tables
  bordered: {
    variant: "bordered" as const,
    size: "default" as const,
    responsive: true,
    mobileView: "scroll" as const,
  },
  
  // Striped tables
  striped: {
    variant: "striped" as const,
    size: "default" as const,
    responsive: true,
    mobileView: "scroll" as const,
  },
  
  // Compact tables
  compact: {
    variant: "compact" as const,
    size: "sm" as const,
    responsive: true,
    mobileView: "scroll" as const,
  },
}

export {
  ResponsiveTable,
  ResponsiveTableHeader,
  ResponsiveTableRow,
  ResponsiveTableCell,
  ResponsiveTableHeaderCell,
} 