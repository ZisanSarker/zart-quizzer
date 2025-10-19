'use client'

import dynamic from 'next/dynamic'
import { ThemeProvider as NextThemesProvider } from "@/components/theme-provider"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { OptimizedErrorBoundary, AsyncErrorBoundary } from "@/components/optimized-error-boundary"
import { usePerformanceOptimization } from "@/hooks/use-performance-optimization"

// Lazy load non-critical providers and monitors
const ServiceWorkerRegister = dynamic(
  () => import('@/components/service-worker-register').then(mod => ({ default: mod.ServiceWorkerRegister })),
  { ssr: false }
)

const PerformanceMonitor = dynamic(
  () => import('@/components/performance-monitor').then(mod => ({ default: mod.PerformanceMonitor })),
  { ssr: false }
)

const DefaultResourcePreloader = dynamic(
  () => import('@/components/resource-preloader').then(mod => ({ default: mod.DefaultResourcePreloader })),
  { ssr: false }
)

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize performance optimizations
  usePerformanceOptimization()

  return (
    <OptimizedErrorBoundary>
      <AsyncErrorBoundary>
        <NextThemesProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <ThemeProvider>
            <AuthProvider>
              <DefaultResourcePreloader />
              {children}
              <Toaster />
              <ServiceWorkerRegister />
              <PerformanceMonitor />
            </AuthProvider>
          </ThemeProvider>
        </NextThemesProvider>
      </AsyncErrorBoundary>
    </OptimizedErrorBoundary>
  )
}
