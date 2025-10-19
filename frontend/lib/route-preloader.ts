/**
 * Route Preloader Utility
 * Intelligently prefetches routes and their dependencies for improved navigation performance
 */

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

// Cache for tracking which routes have been preloaded
const preloadedRoutes = new Set<string>()

// Priority levels for preloading
export enum PreloadPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

interface PreloadOptions {
  priority?: PreloadPriority
  delay?: number
  prefetchData?: boolean
}

/**
 * Preload a specific route with optional priority and delay
 */
export const preloadRoute = (
  router: ReturnType<typeof useRouter>,
  href: string,
  options: PreloadOptions = {}
) => {
  const { priority = PreloadPriority.MEDIUM, delay = 0, prefetchData = false } = options

  // Skip if already preloaded
  if (preloadedRoutes.has(href)) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    const preloadFn = () => {
      try {
        // Use Next.js router prefetch
        router.prefetch(href)
        preloadedRoutes.add(href)
        resolve()
      } catch (error) {
        console.error(`Failed to preload route: ${href}`, error)
        resolve()
      }
    }

    if (delay > 0) {
      setTimeout(preloadFn, delay)
    } else {
      // Use requestIdleCallback for better performance
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(preloadFn, { timeout: 2000 })
      } else {
        setTimeout(preloadFn, 100)
      }
    }
  })
}

/**
 * Preload multiple routes in order of priority
 */
export const preloadRoutes = (
  router: ReturnType<typeof useRouter>,
  routes: Array<{ href: string; options?: PreloadOptions }>
) => {
  // Sort by priority
  const sortedRoutes = [...routes].sort((a, b) => {
    const priorityOrder = {
      [PreloadPriority.HIGH]: 3,
      [PreloadPriority.MEDIUM]: 2,
      [PreloadPriority.LOW]: 1,
    }
    const aPriority = priorityOrder[a.options?.priority || PreloadPriority.MEDIUM]
    const bPriority = priorityOrder[b.options?.priority || PreloadPriority.MEDIUM]
    return bPriority - aPriority
  })

  // Preload routes with staggered delays based on priority
  return Promise.allSettled(
    sortedRoutes.map((route, index) => {
      const baseDelay = route.options?.delay || 0
      const staggerDelay = index * 50 // Stagger by 50ms
      return preloadRoute(router, route.href, {
        ...route.options,
        delay: baseDelay + staggerDelay,
      })
    })
  )
}

/**
 * Hook for route preloading with smart caching
 */
export const useRoutePreloader = () => {
  const router = useRouter()
  const preloadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const prefetchRoute = useCallback(
    (href: string, options?: PreloadOptions) => {
      return preloadRoute(router, href, options)
    },
    [router]
  )

  const prefetchRoutes = useCallback(
    (routes: Array<{ href: string; options?: PreloadOptions }>) => {
      return preloadRoutes(router, routes)
    },
    [router]
  )

  const prefetchOnHover = useCallback(
    (href: string, delay: number = 100) => {
      // Clear any existing timeout
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current)
      }

      // Set new timeout for hover preload
      preloadTimeoutRef.current = setTimeout(() => {
        prefetchRoute(href, { priority: PreloadPriority.HIGH })
      }, delay)
    },
    [prefetchRoute]
  )

  const cancelPrefetch = useCallback(() => {
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current)
      }
    }
  }, [])

  return {
    prefetchRoute,
    prefetchRoutes,
    prefetchOnHover,
    cancelPrefetch,
  }
}

/**
 * Preload routes based on user authentication status
 */
export const preloadAuthenticatedRoutes = (
  router: ReturnType<typeof useRouter>,
  isAuthenticated: boolean
) => {
  if (isAuthenticated) {
    return preloadRoutes(router, [
      { href: '/dashboard', options: { priority: PreloadPriority.HIGH } },
      { href: '/dashboard/create', options: { priority: PreloadPriority.MEDIUM } },
      { href: '/dashboard/library', options: { priority: PreloadPriority.MEDIUM } },
      { href: '/dashboard/profile', options: { priority: PreloadPriority.LOW, delay: 500 } },
      { href: '/explore', options: { priority: PreloadPriority.MEDIUM } },
    ])
  } else {
    return preloadRoutes(router, [
      { href: '/login', options: { priority: PreloadPriority.HIGH } },
      { href: '/register', options: { priority: PreloadPriority.HIGH } },
      { href: '/explore', options: { priority: PreloadPriority.MEDIUM } },
    ])
  }
}

/**
 * Preload dashboard-specific routes
 */
export const preloadDashboardRoutes = (router: ReturnType<typeof useRouter>) => {
  return preloadRoutes(router, [
    { href: '/dashboard/create', options: { priority: PreloadPriority.HIGH } },
    { href: '/dashboard/library', options: { priority: PreloadPriority.HIGH } },
    { href: '/dashboard/history', options: { priority: PreloadPriority.MEDIUM } },
    { href: '/dashboard/profile', options: { priority: PreloadPriority.MEDIUM } },
    { href: '/dashboard/settings', options: { priority: PreloadPriority.LOW, delay: 500 } },
  ])
}

/**
 * Preload explore page routes
 */
export const preloadExploreRoutes = (router: ReturnType<typeof useRouter>) => {
  return preloadRoutes(router, [
    { href: '/explore', options: { priority: PreloadPriority.HIGH } },
    { href: '/dashboard', options: { priority: PreloadPriority.MEDIUM, delay: 200 } },
  ])
}

/**
 * Clear all preloaded routes cache
 */
export const clearPreloadCache = () => {
  preloadedRoutes.clear()
}

/**
 * Check if a route has been preloaded
 */
export const isRoutePreloaded = (href: string): boolean => {
  return preloadedRoutes.has(href)
}
