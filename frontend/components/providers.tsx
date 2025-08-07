'use client'

import { ThemeProvider as NextThemesProvider } from "@/components/theme-provider"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { DefaultResourcePreloader } from "@/components/resource-preloader"
import { OptimizedErrorBoundary, AsyncErrorBoundary } from "@/components/optimized-error-boundary"
import { usePerformanceOptimization } from "@/hooks/use-performance-optimization"

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize performance optimizations
  usePerformanceOptimization()

  return (
    <OptimizedErrorBoundary>
      <AsyncErrorBoundary>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
