/**
 * Component Preloader Utility
 * Intelligently preloads components and chunks based on user behavior and route patterns
 */

import { 
  preloadCriticalComponents,
  preloadDashboardComponents,
  preloadQuizComponents,
  preloadExploreComponents,
  preloadAuthComponents,
} from '@/components/lazy-components'

// Component preload registry
const preloadedComponents = new Set<string>()

/**
 * Preload components for a specific route
 */
export const preloadComponentsForRoute = async (route: string): Promise<void> => {
  // Avoid duplicate preloads
  if (preloadedComponents.has(route)) {
    return
  }

  try {
    if (route.startsWith('/dashboard/create')) {
      await preloadQuizComponents()
    } else if (route.startsWith('/dashboard/quiz/practice')) {
      await preloadQuizComponents()
    } else if (route.startsWith('/dashboard/quiz/result')) {
      await preloadQuizComponents()
    } else if (route.startsWith('/dashboard/library')) {
      await preloadDashboardComponents()
    } else if (route.startsWith('/dashboard/history')) {
      await preloadDashboardComponents()
    } else if (route.startsWith('/dashboard/profile')) {
      await preloadDashboardComponents()
    } else if (route.startsWith('/dashboard/settings')) {
      await preloadDashboardComponents()
    } else if (route.startsWith('/dashboard')) {
      await preloadDashboardComponents()
    } else if (route.startsWith('/explore')) {
      await preloadExploreComponents()
    } else if (route.startsWith('/login') || route.startsWith('/register')) {
      await preloadAuthComponents()
    } else if (route === '/') {
      await preloadCriticalComponents()
    }

    preloadedComponents.add(route)
  } catch (error) {
    console.error(`Failed to preload components for route: ${route}`, error)
  }
}

/**
 * Preload components based on viewport intersection
 */
export const setupIntersectionPreload = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          const preloadRoute = target.dataset.preloadRoute
          
          if (preloadRoute) {
            preloadComponentsForRoute(preloadRoute)
            observer.unobserve(target)
          }
        }
      })
    },
    {
      rootMargin: '50px',
      threshold: 0.1,
    }
  )

  // Observe all links with data-preload-route attribute
  const preloadLinks = document.querySelectorAll('[data-preload-route]')
  preloadLinks.forEach((link) => observer.observe(link))

  return () => {
    observer.disconnect()
  }
}

/**
 * Preload components on hover with delay
 */
export const preloadOnHover = (route: string, delay: number = 100) => {
  let timeoutId: NodeJS.Timeout

  return {
    onMouseEnter: () => {
      timeoutId = setTimeout(() => {
        preloadComponentsForRoute(route)
      }, delay)
    },
    onMouseLeave: () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    },
  }
}

/**
 * Preload components on focus (for keyboard navigation)
 */
export const preloadOnFocus = (route: string) => {
  return {
    onFocus: () => {
      preloadComponentsForRoute(route)
    },
  }
}

/**
 * Smart preload based on user behavior patterns
 */
export const smartPreload = async (currentRoute: string) => {
  // Define likely next routes based on current route
  const preloadMap: Record<string, string[]> = {
    '/': ['/dashboard', '/explore', '/login'],
    '/dashboard': ['/dashboard/create', '/dashboard/library', '/dashboard/profile'],
    '/dashboard/create': ['/dashboard/library', '/dashboard/quiz/preview'],
    '/dashboard/library': ['/dashboard/quiz/practice', '/dashboard/quiz/preview'],
    '/dashboard/history': ['/dashboard/quiz/result'],
    '/explore': ['/dashboard', '/dashboard/quiz/practice'],
    '/login': ['/dashboard', '/register'],
    '/register': ['/dashboard', '/login'],
  }

  const routesToPreload = preloadMap[currentRoute] || []

  // Preload likely next routes with staggered timing
  routesToPreload.forEach((route, index) => {
    setTimeout(() => {
      preloadComponentsForRoute(route)
    }, index * 200)
  })
}

/**
 * Preload components during idle time
 */
export const preloadDuringIdle = (routes: string[]) => {
  if (typeof window === 'undefined') {
    return
  }

  const idleCallback = 'requestIdleCallback' in window 
    ? window.requestIdleCallback 
    : (cb: IdleRequestCallback) => setTimeout(cb, 1)

  routes.forEach((route, index) => {
    idleCallback(() => {
      setTimeout(() => {
        preloadComponentsForRoute(route)
      }, index * 100)
    }, { timeout: 2000 })
  })
}

/**
 * Clear preload cache
 */
export const clearPreloadCache = () => {
  preloadedComponents.clear()
}

/**
 * Check if components for a route have been preloaded
 */
export const areComponentsPreloaded = (route: string): boolean => {
  return preloadedComponents.has(route)
}

/**
 * Batch preload multiple routes
 */
export const batchPreloadRoutes = async (routes: string[]): Promise<void> => {
  await Promise.allSettled(
    routes.map((route) => preloadComponentsForRoute(route))
  )
}
