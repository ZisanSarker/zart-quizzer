'use client'

import { useEffect, useRef } from 'react'

interface ResourcePreloaderProps {
  criticalImages?: string[]
  criticalFonts?: string[]
  criticalScripts?: string[]
  preloadRoutes?: string[]
}

export function ResourcePreloader({
  criticalImages = [],
  criticalFonts = [],
  criticalScripts = [],
  preloadRoutes = []
}: ResourcePreloaderProps) {
  const preloadedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Preload critical images
    criticalImages.forEach(src => {
      if (!preloadedRef.current.has(`image-${src}`)) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = src
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
        preloadedRef.current.add(`image-${src}`)
      }
    })

    // Preload critical fonts
    criticalFonts.forEach(href => {
      if (!preloadedRef.current.has(`font-${href}`)) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'font'
        link.href = href
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
        preloadedRef.current.add(`font-${href}`)
      }
    })

    // Preload critical scripts
    criticalScripts.forEach(src => {
      if (!preloadedRef.current.has(`script-${src}`)) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'script'
        link.href = src
        document.head.appendChild(link)
        preloadedRef.current.add(`script-${src}`)
      }
    })

    // Preload routes
    preloadRoutes.forEach(route => {
      if (!preloadedRef.current.has(`route-${route}`)) {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = route
        document.head.appendChild(link)
        preloadedRef.current.add(`route-${route}`)
      }
    })
  }, [criticalImages, criticalFonts, criticalScripts, preloadRoutes])

  return null
}

// Hook for intelligent resource preloading
export const useResourcePreloader = () => {
  const preloadImage = (src: string) => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }

  const preloadFont = (href: string) => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.href = href
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }

  const preloadScript = (src: string) => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'script'
    link.href = src
    document.head.appendChild(link)
  }

  const preloadRoute = (route: string) => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = route
    document.head.appendChild(link)
  }

  const preloadComponent = (componentPath: string) => {
    if (typeof window === 'undefined') return

    // Preload component by importing it
    import(componentPath).catch(() => {
      // Silently fail if component doesn't exist
    })
  }

  return {
    preloadImage,
    preloadFont,
    preloadScript,
    preloadRoute,
    preloadComponent
  }
}

// Critical resources for the application
export const CRITICAL_RESOURCES = {
  images: [
    '/placeholder-logo.png',
    '/placeholder-user.jpg',
    '/placeholder-logo.svg',
    '/landing1.png',
    '/landing2.png',
    '/landing3.png'
  ],
  fonts: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Playfair+Display+SC:wght@400&display=swap'
  ],
  routes: [
    '/dashboard',
    '/explore',
    '/login',
    '/register',
    '/dashboard/create',
    '/dashboard/library'
  ]
}

// Default preloader component
export function DefaultResourcePreloader() {
  return (
    <ResourcePreloader
      criticalImages={CRITICAL_RESOURCES.images}
      criticalFonts={CRITICAL_RESOURCES.fonts}
      preloadRoutes={CRITICAL_RESOURCES.routes}
    />
  )
}
