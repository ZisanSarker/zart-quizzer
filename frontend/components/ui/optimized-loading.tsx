import { cn } from "@/lib/utils"

interface OptimizedLoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'skeleton' | 'pulse'
  text?: string
}

export function OptimizedLoading({ 
  className, 
  size = 'md', 
  variant = 'spinner',
  text 
}: OptimizedLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const renderSpinner = () => (
    <div className={cn(
      "animate-spin rounded-full border-2 border-muted border-t-primary",
      sizeClasses[size],
      className
    )} />
  )

  const renderDots = () => (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-primary rounded-full animate-pulse",
            size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
          )}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  )

  const renderSkeleton = () => (
    <div className={cn("animate-pulse bg-muted rounded", className)}>
      <div className="h-4 bg-muted rounded mb-2" />
      <div className="h-4 bg-muted rounded mb-2 w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>
  )

  const renderPulse = () => (
    <div className={cn("animate-pulse bg-muted rounded", className)} />
  )

  const renderContent = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'skeleton':
        return renderSkeleton()
      case 'pulse':
        return renderPulse()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderContent()}
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Optimized skeleton components for different content types
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="h-48 bg-muted rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="flex justify-between pt-2">
          <div className="h-8 bg-muted rounded w-20" />
          <div className="h-8 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function GridSkeleton({ 
  rows = 3, 
  cols = 3, 
  className 
}: { 
  rows?: number; 
  cols?: number; 
  className?: string 
}) {
  return (
    <div className={cn("grid gap-4", className)} style={{ 
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
    }}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableSkeleton({ 
  rows = 5, 
  cols = 4, 
  className 
}: { 
  rows?: number; 
  cols?: number; 
  className?: string 
}) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="grid gap-4" style={{ 
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
      }}>
        {/* Header */}
        {Array.from({ length: cols }).map((_, i) => (
          <div key={`header-${i}`} className="h-6 bg-muted rounded" />
        ))}
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          Array.from({ length: cols }).map((_, colIndex) => (
            <div key={`row-${rowIndex}-col-${colIndex}`} className="h-4 bg-muted rounded" />
          ))
        ))}
      </div>
    </div>
  )
}

// Preload indicator for better perceived performance
export function PreloadIndicator({ 
  onComplete, 
  className 
}: { 
  onComplete?: () => void; 
  className?: string 
}) {
  return (
    <div className={cn("fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center", className)}>
      <div className="text-center">
        <OptimizedLoading size="lg" variant="spinner" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading your experience...
        </p>
      </div>
    </div>
  )
}
