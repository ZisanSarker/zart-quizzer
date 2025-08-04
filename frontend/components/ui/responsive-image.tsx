import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Image from "next/image"

const responsiveImageVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "rounded-lg",
        circle: "rounded-full",
        square: "rounded-none",
        card: "rounded-lg shadow-sm",
        elevated: "rounded-lg shadow-lg",
      },
      size: {
        default: "w-full h-auto",
        sm: "w-16 h-16 sm:w-20 sm:h-20",
        md: "w-24 h-24 sm:w-32 sm:h-32",
        lg: "w-32 h-32 sm:w-40 sm:h-40",
        xl: "w-40 h-40 sm:w-48 sm:h-48",
        // Responsive sizes
        mobile: "w-full h-48 sm:h-64",
        tablet: "w-full h-64 md:h-80",
        desktop: "w-full h-80 lg:h-96",
        hero: "w-full h-64 sm:h-80 lg:h-96 xl:h-[500px]",
      },
      aspect: {
        square: "aspect-square",
        video: "aspect-video",
        photo: "aspect-[4/3]",
        wide: "aspect-[16/9]",
        portrait: "aspect-[3/4]",
        auto: "",
      },
      responsive: {
        true: "w-full h-auto",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      aspect: "auto",
      responsive: true,
    },
  }
)

const responsiveImageOverlayVariants = cva(
  "absolute inset-0 flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-black/20",
        dark: "bg-black/40",
        light: "bg-white/20",
        gradient: "bg-gradient-to-t from-black/60 via-transparent to-transparent",
      },
      position: {
        top: "items-start",
        center: "items-center",
        bottom: "items-end",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "center",
    },
  }
)

export interface ResponsiveImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof responsiveImageVariants> {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  overlay?: React.ReactNode
  overlayVariant?: VariantProps<typeof responsiveImageOverlayVariants>["variant"]
  overlayPosition?: VariantProps<typeof responsiveImageOverlayVariants>["position"]
  asNextImage?: boolean
}

const ResponsiveImage = React.forwardRef<HTMLImageElement, ResponsiveImageProps>(
  ({ 
    className, 
    variant, 
    size, 
    aspect, 
    responsive, 
    src, 
    alt, 
    fill = false,
    sizes,
    priority = false,
    quality = 75,
    placeholder = "empty",
    blurDataURL,
    overlay,
    overlayVariant,
    overlayPosition,
    asNextImage = true,
    ...props 
  }, ref) => {
    if (asNextImage) {
      return (
        <div className={cn(responsiveImageVariants({ variant, size, aspect, responsive }), className)}>
          <Image
            ref={ref}
            src={src}
            alt={alt}
            fill={fill}
            sizes={sizes}
            priority={priority}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            className={cn(
              "object-cover",
              fill ? "absolute inset-0" : "w-full h-full"
            )}
            {...props}
          />
          {overlay && (
            <div className={cn(responsiveImageOverlayVariants({ variant: overlayVariant, position: overlayPosition }))}>
              {overlay}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className={cn(responsiveImageVariants({ variant, size, aspect, responsive }), className)}>
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={cn(
            "object-cover",
            fill ? "absolute inset-0" : "w-full h-full"
          )}
          {...props}
        />
        {overlay && (
          <div className={cn(responsiveImageOverlayVariants({ variant: overlayVariant, position: overlayPosition }))}>
            {overlay}
          </div>
        )}
      </div>
    )
  }
)
ResponsiveImage.displayName = "ResponsiveImage"

// Predefined responsive image configurations
export const ResponsiveImageConfigs = {
  // Avatar images
  avatar: {
    variant: "circle" as const,
    size: "md" as const,
    aspect: "square" as const,
    responsive: false,
  },
  
  // Thumbnail images
  thumbnail: {
    variant: "default" as const,
    size: "sm" as const,
    aspect: "square" as const,
    responsive: false,
  },
  
  // Card images
  card: {
    variant: "card" as const,
    size: "mobile" as const,
    aspect: "video" as const,
    responsive: true,
  },
  
  // Hero images
  hero: {
    variant: "elevated" as const,
    size: "hero" as const,
    aspect: "wide" as const,
    responsive: true,
  },
  
  // Gallery images
  gallery: {
    variant: "default" as const,
    size: "mobile" as const,
    aspect: "square" as const,
    responsive: true,
  },
  
  // Banner images
  banner: {
    variant: "default" as const,
    size: "desktop" as const,
    aspect: "wide" as const,
    responsive: true,
  },
}

export { ResponsiveImage } 