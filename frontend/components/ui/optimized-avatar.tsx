"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Size = "xs" | "sm" | "md" | "lg" | "xl"

const sizeClassMap: Record<Size, string> = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-24 w-24",
  xl: "h-32 w-32",
}

const defaultSizesMap: Record<Size, string> = {
  xs: "24px",
  sm: "(max-width: 640px) 32px, 40px",
  md: "(max-width: 640px) 40px, 48px",
  lg: "(max-width: 640px) 96px, 128px",
  xl: "(max-width: 640px) 128px, 160px",
}

export interface OptimizedAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt: string
  fallbackText?: string
  size?: Size
  /** Override Image sizes attribute; defaults based on size */
  sizes?: string
  /** Pass through to next/image */
  priority?: boolean
  quality?: number
}

export function OptimizedAvatar({
  src,
  alt,
  fallbackText = "?",
  size = "md",
  className,
  sizes,
  priority = false,
  quality = 75,
  ...rest
}: OptimizedAvatarProps) {
  const [errored, setErrored] = React.useState<boolean>(false)
  const [loaded, setLoaded] = React.useState<boolean>(false)

  const showFallback = !src || errored || !loaded
  const computedSizes = sizes ?? defaultSizesMap[size]

  return (
    <Avatar className={cn(sizeClassMap[size], className)} {...rest}>
      <div className="relative h-full w-full overflow-hidden rounded-full">
        {src && !errored && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={computedSizes}
            priority={priority}
            quality={quality}
            className={cn("object-cover")}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
          />
        )}
        {showFallback && (
          <AvatarFallback className="flex items-center justify-center bg-muted">
            {fallbackText}
          </AvatarFallback>
        )}
      </div>
    </Avatar>
  )
}

export default OptimizedAvatar
