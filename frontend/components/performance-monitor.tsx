'use client'

import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  lcp: number
  fid: number
  cls: number
  ttfb: number
  fcp: number
}

export function PerformanceMonitor() {
  const metricsRef = useRef<PerformanceMetrics>({
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    fcp: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Measure Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      metricsRef.current.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
    }

    // Measure First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries[entries.length - 1]
      metricsRef.current.fcp = fcpEntry.startTime
      console.log('FCP:', fcpEntry.startTime)
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Measure Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      metricsRef.current.lcp = lastEntry.startTime
      console.log('LCP:', lastEntry.startTime)
      
      // Report to analytics if needed
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'LCP',
          value: Math.round(lastEntry.startTime)
        })
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // Measure First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        const fid = entry.processingStart - entry.startTime
        metricsRef.current.fid = fid
        console.log('FID:', fid)
        
        // Report to analytics if needed
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'FID',
            value: Math.round(fid)
          })
        }
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Measure Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      metricsRef.current.cls = clsValue
      console.log('CLS:', clsValue)
      
      // Report to analytics if needed
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'CLS',
          value: Math.round(clsValue * 1000) / 1000
        })
      }
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Measure resource loading performance
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming
        if (resourceEntry.initiatorType === 'img' || resourceEntry.initiatorType === 'script') {
          console.log(`${resourceEntry.name} loaded in ${resourceEntry.duration}ms`)
        }
      })
    })
    resourceObserver.observe({ entryTypes: ['resource'] })

    // Measure long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log('Long task detected:', entry.duration, 'ms')
        
        // Report to analytics if needed
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'long_task', {
            event_category: 'Performance',
            event_label: 'Long Task',
            value: Math.round(entry.duration)
          })
        }
      })
    })
    longTaskObserver.observe({ entryTypes: ['longtask'] })

    // Cleanup observers
    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
      resourceObserver.disconnect()
      longTaskObserver.disconnect()
    }
  }, [])

  // Log performance metrics on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('Final Performance Metrics:', metricsRef.current)
      
      // Send metrics to analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'performance_metrics', {
          event_category: 'Performance',
          lcp: Math.round(metricsRef.current.lcp),
          fid: Math.round(metricsRef.current.fid),
          cls: Math.round(metricsRef.current.cls * 1000) / 1000,
          ttfb: Math.round(metricsRef.current.ttfb),
          fcp: Math.round(metricsRef.current.fcp)
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return null
}

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const logMetric = (name: string, value: number) => {
    console.log(`Performance Metric - ${name}:`, value)
    
    // Report to analytics if needed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'custom_performance', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value)
      })
    }
  }

  const measureTime = (name: string, fn: () => void) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    logMetric(name, end - start)
  }

  const measureAsyncTime = async (name: string, fn: () => Promise<void>) => {
    const start = performance.now()
    await fn()
    const end = performance.now()
    logMetric(name, end - start)
  }

  return {
    logMetric,
    measureTime,
    measureAsyncTime
  }
}
