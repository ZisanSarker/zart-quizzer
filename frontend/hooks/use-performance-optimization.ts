import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>()

// Resource hints for prefetching
const prefetchQueue = new Set<string>()

export const usePerformanceOptimization = () => {
  const router = useRouter()
  const prefetchTimeoutRef = useRef<NodeJS.Timeout>()

  // Intelligent prefetching based on user behavior
  const prefetchRoute = useCallback((href: string) => {
    if (prefetchQueue.has(href)) return
    
    prefetchQueue.add(href)
    
    // Debounce prefetch to avoid overwhelming the network
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current)
    }
    
    prefetchTimeoutRef.current = setTimeout(() => {
      router.prefetch(href)
      prefetchQueue.delete(href)
    }, 100)
  }, [router])

  // Cache management
  const getCachedData = useCallback((key: string) => {
    const cached = apiCache.get(key)
    if (!cached) return null
    
    const now = Date.now()
    if (now - cached.timestamp > cached.ttl) {
      apiCache.delete(key)
      return null
    }
    
    return cached.data
  }, [])

  const setCachedData = useCallback((key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    apiCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }, [])

  const clearCache = useCallback((pattern?: string) => {
    if (pattern) {
      for (const key of apiCache.keys()) {
        if (key.includes(pattern)) {
          apiCache.delete(key)
        }
      }
    } else {
      apiCache.clear()
    }
  }, [])

  // Resource optimization
  const optimizeImages = useCallback(() => {
    // Intersection Observer for lazy loading images
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          }
        })
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      })

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }
  }, [])

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    if (typeof window === 'undefined') return

    // Preload critical fonts
    const fontLinks = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Playfair+Display+SC:wght@400&display=swap'
    ]

    fontLinks.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'style'
        link.href = href
        link.onload = () => {
          link.rel = 'stylesheet'
        }
        document.head.appendChild(link)
      }
    })

    // Preload critical images
    const criticalImages = [
      '/placeholder-logo.png',
      '/placeholder-user.jpg'
    ]

    criticalImages.forEach(src => {
      if (!document.querySelector(`link[href="${src}"]`)) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = src
        document.head.appendChild(link)
      }
    })
  }, [])

  // Performance monitoring
  const measurePerformance = useCallback(() => {
    if (typeof window === 'undefined') return

    // Measure Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        console.log('CLS:', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
  }, [])

  // Memory management
  const cleanupMemory = useCallback(() => {
    // Clear old cache entries
    const now = Date.now()
    for (const [key, value] of apiCache.entries()) {
      if (now - value.timestamp > value.ttl) {
        apiCache.delete(key)
      }
    }

    // Clear prefetch queue if it gets too large
    if (prefetchQueue.size > 10) {
      prefetchQueue.clear()
    }
  }, [])

  // Initialize performance optimizations
  useEffect(() => {
    preloadCriticalResources()
    measurePerformance()
    optimizeImages()

    // Set up periodic cleanup
    const cleanupInterval = setInterval(cleanupMemory, 60000) // Every minute

    return () => {
      clearInterval(cleanupInterval)
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current)
      }
    }
  }, [preloadCriticalResources, measurePerformance, optimizeImages, cleanupMemory])

  return {
    prefetchRoute,
    getCachedData,
    setCachedData,
    clearCache,
    optimizeImages,
    preloadCriticalResources,
    measurePerformance,
    cleanupMemory
  }
}

// Hook for optimizing API calls
export const useOptimizedApiCall = <T>(
  apiCall: () => Promise<T>,
  cacheKey: string,
  ttl: number = 5 * 60 * 1000
) => {
  const { getCachedData, setCachedData } = usePerformanceOptimization()

  const optimizedCall = useCallback(async () => {
    // Check cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    // Make API call
    const data = await apiCall()
    
    // Cache the result
    setCachedData(cacheKey, data, ttl)
    
    return data
  }, [apiCall, cacheKey, ttl, getCachedData, setCachedData])

  return optimizedCall
}

// Hook for route-based prefetching
export const useRoutePrefetching = () => {
  const { prefetchRoute } = usePerformanceOptimization()

  const prefetchDashboard = useCallback(() => {
    prefetchRoute('/dashboard')
    prefetchRoute('/dashboard/library')
    prefetchRoute('/dashboard/create')
  }, [prefetchRoute])

  const prefetchExplore = useCallback(() => {
    prefetchRoute('/explore')
  }, [prefetchRoute])

  const prefetchAuth = useCallback(() => {
    prefetchRoute('/login')
    prefetchRoute('/register')
  }, [prefetchRoute])

  return {
    prefetchDashboard,
    prefetchExplore,
    prefetchAuth
  }
}
