import dynamic from 'next/dynamic'
import { Suspense, ComponentType } from 'react'
import { LoadingSpinner } from '@/components/ui/feedback'

// ======================
// ANIMATION COMPONENTS
// ======================
export const LazyAnimatedGallery = dynamic(
  () => import('@/components/animated-gallery').then(mod => ({ default: mod.AnimatedGallery })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Disable SSR for animations
  }
)

export const LazyLottieAnimation = dynamic(
  () => import('@/components/lottie-animation').then(mod => ({ default: mod.LottieAnimation })),
  {
    loading: () => <div className="w-16 h-16 bg-muted rounded animate-pulse" />,
    ssr: false,
  }
)

// ======================
// CHART & DATA VIZ COMPONENTS
// ======================
export const LazyChart = dynamic(
  () => import('@/components/ui/chart').then(mod => ({ default: mod.ChartContainer })),
  {
    loading: () => <div className="w-full h-64 bg-muted rounded animate-pulse" />,
    ssr: false,
  }
)

export const LazyChartContainer = dynamic(
  () => import('recharts').then(mod => mod.ResponsiveContainer),
  {
    loading: () => <div className="w-full h-full bg-muted rounded animate-pulse" />,
    ssr: false,
  }
)

export const LazyBarChart = dynamic(
  () => import('recharts').then(mod => mod.BarChart),
  { ssr: false }
)

export const LazyLineChart = dynamic(
  () => import('recharts').then(mod => mod.LineChart),
  { ssr: false }
)

export const LazyPieChart = dynamic(
  () => import('recharts').then(mod => mod.PieChart),
  { ssr: false }
)

export const LazyRadarChart = dynamic(
  () => import('recharts').then(mod => mod.RadarChart),
  { ssr: false }
)

// ======================
// UI COMPONENTS (Heavy)
// ======================
export const LazyCarousel = dynamic(
  () => import('@/components/ui/carousel').then(mod => ({ default: mod.Carousel })),
  {
    loading: () => <div className="w-full h-48 bg-muted rounded animate-pulse" />,
  }
)

export const LazyDrawer = dynamic(
  () => import('@/components/ui/drawer').then(mod => ({ default: mod.Drawer })),
  {
    loading: () => null,
  }
)

export const LazySheet = dynamic(
  () => import('@/components/ui/sheet').then(mod => ({ default: mod.Sheet })),
  {
    loading: () => null,
  }
)

export const LazyResizable = dynamic(
  () => import('@/components/ui/resizable').then(mod => ({ default: mod.ResizablePanelGroup })),
  {
    loading: () => <div className="w-full h-64 bg-muted rounded animate-pulse" />,
    ssr: false,
  }
)

export const LazyCalendar = dynamic(
  () => import('@/components/ui/calendar').then(mod => ({ default: mod.Calendar })),
  {
    loading: () => <div className="w-full h-80 bg-muted rounded animate-pulse" />,
  }
)

export const LazyCommand = dynamic(
  () => import('@/components/ui/command').then(mod => ({ default: mod.Command })),
  {
    loading: () => null,
  }
)

export const LazyContextMenu = dynamic(
  () => import('@/components/ui/context-menu').then(mod => ({ default: mod.ContextMenu })),
  {
    loading: () => null,
  }
)

export const LazyHoverCard = dynamic(
  () => import('@/components/ui/hover-card').then(mod => ({ default: mod.HoverCard })),
  {
    loading: () => null,
  }
)

export const LazyMenubar = dynamic(
  () => import('@/components/ui/menubar').then(mod => ({ default: mod.Menubar })),
  {
    loading: () => null,
  }
)

export const LazyNavigationMenu = dynamic(
  () => import('@/components/ui/navigation-menu').then(mod => ({ default: mod.NavigationMenu })),
  {
    loading: () => null,
  }
)

// ======================
// DASHBOARD COMPONENTS
// ======================
export const LazyStatsGrid = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.StatsGrid })),
  {
    loading: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 bg-muted rounded animate-pulse" />
      ))}
    </div>,
  }
)

export const LazyQuizSection = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.QuizSection })),
  {
    loading: () => <div className="space-y-4">
      <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>,
  }
)

export const LazyMotivationSection = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.MotivationSection })),
  {
    loading: () => <div className="h-32 bg-muted rounded animate-pulse" />,
  }
)

export const LazyQuizCard = dynamic(
  () => import('@/components/dashboard/quiz-card').then(mod => ({ default: mod.QuizCard })),
  {
    loading: () => <div className="h-48 bg-muted rounded animate-pulse" />,
  }
)

export const LazyStatsCard = dynamic(
  () => import('@/components/dashboard/stats-card').then(mod => ({ default: mod.StatsCard })),
  {
    loading: () => <div className="h-32 bg-muted rounded animate-pulse" />,
  }
)

export const LazyChartCard = dynamic(
  () => import('@/components/dashboard/chart-card').then(mod => ({ default: mod.ChartCard })),
  {
    loading: () => <div className="h-64 bg-muted rounded animate-pulse" />,
    ssr: false,
  }
)

export const LazyQuizForm = dynamic(
  () => import('@/components/dashboard/quiz-form').then(mod => ({ default: mod.QuizForm })),
  {
    loading: () => <div className="space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-16 bg-muted rounded animate-pulse" />
      ))}
    </div>,
  }
)

export const LazyProfileEditForm = dynamic(
  () => import('@/components/dashboard/profile-edit-form').then(mod => ({ default: mod.ProfileEditForm })),
  {
    loading: () => <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-16 bg-muted rounded animate-pulse" />
      ))}
    </div>,
  }
)

export const LazyLibraryQuizCard = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.LibraryQuizCard })),
  {
    loading: () => <div className="h-48 bg-muted rounded animate-pulse" />,
  }
)

export const LazyHistoryItem = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.HistoryItem })),
  {
    loading: () => <div className="h-24 bg-muted rounded animate-pulse" />,
  }
)

export const LazyHistoryPerformance = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.HistoryPerformance })),
  {
    loading: () => <div className="h-96 bg-muted rounded animate-pulse" />,
    ssr: false,
  }
)

export const LazyHistoryAchievements = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.HistoryAchievements })),
  {
    loading: () => <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-32 bg-muted rounded animate-pulse" />
      ))}
    </div>,
  }
)

// ======================
// QUIZ COMPONENTS
// ======================
export const LazyQuizPracticeQuestion = dynamic(
  () => import('@/components/quiz').then(mod => ({ default: mod.QuizPracticeQuestion })),
  {
    loading: () => <div className="space-y-4">
      <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>,
  }
)

export const LazyQuizRatingModal = dynamic(
  () => import('@/components/quiz').then(mod => ({ default: mod.QuizRatingModal })),
  {
    loading: () => null,
  }
)

export const LazyQuizPracticeHeader = dynamic(
  () => import('@/components/quiz').then(mod => ({ default: mod.QuizPracticeHeader })),
  {
    loading: () => <div className="h-20 bg-muted rounded animate-pulse" />,
  }
)

export const LazyQuizPracticeActions = dynamic(
  () => import('@/components/quiz').then(mod => ({ default: mod.QuizPracticeActions })),
  {
    loading: () => <div className="h-16 bg-muted rounded animate-pulse" />,
  }
)

export const LazyQuizResultSummary = dynamic(
  () => import('@/components/quiz').then(mod => ({ default: mod.QuizResultSummary })),
  {
    loading: () => <div className="h-48 bg-muted rounded animate-pulse" />,
  }
)

export const LazyQuizResultReview = dynamic(
  () => import('@/components/quiz').then(mod => ({ default: mod.QuizResultReview })),
  {
    loading: () => <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-muted rounded animate-pulse" />
      ))}
    </div>,
  }
)

export const LazyQuizResultHeader = dynamic(
  () => import('@/components/quiz').then(mod => ({ default: mod.QuizResultHeader })),
  {
    loading: () => <div className="h-24 bg-muted rounded animate-pulse" />,
  }
)

export const LazyQuizResultFooter = dynamic(
  () => import('@/components/quiz').then(mod => ({ default: mod.QuizResultFooter })),
  {
    loading: () => <div className="h-16 bg-muted rounded animate-pulse" />,
  }
)

// ======================
// EXPLORE COMPONENTS
// ======================
export const LazyExploreContent = dynamic(
  () => import('@/components/explore').then(mod => ({ default: mod.ExploreContent })),
  {
    loading: () => <div className="space-y-6">
      <div className="h-10 bg-muted rounded w-1/2 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-48 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>,
  }
)

export const LazyExploreHeader = dynamic(
  () => import('@/components/explore/explore-header').then(mod => ({ default: mod.ExploreHeader })),
  {
    loading: () => <div className="h-32 bg-muted rounded animate-pulse" />,
  }
)

// ======================
// PROFILE COMPONENTS
// ======================
export const LazyUserProfileStats = dynamic(
  () => import('@/components/profile').then(mod => ({ default: mod.UserProfileStats })),
  {
    loading: () => <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="text-center">
          <div className="h-8 bg-muted rounded w-16 mx-auto mb-2 animate-pulse" />
          <div className="h-4 bg-muted rounded w-20 mx-auto animate-pulse" />
        </div>
      ))}
    </div>,
  }
)

export const LazyProfileAbout = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.ProfileAbout })),
  {
    loading: () => <div className="h-64 bg-muted rounded animate-pulse" />,
  }
)

export const LazyProfileSecurity = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.ProfileSecurity })),
  {
    loading: () => <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-muted rounded animate-pulse" />
      ))}
    </div>,
  }
)

export const LazyProfileSidebar = dynamic(
  () => import('@/components/dashboard/profile-sidebar').then(mod => ({ default: mod.ProfileSidebar })),
  {
    loading: () => <div className="h-96 bg-muted rounded animate-pulse" />,
  }
)

export const LazyProfileStats = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.ProfileStats })),
  {
    loading: () => <div className="h-48 bg-muted rounded animate-pulse" />,
  }
)

// ======================
// SETTINGS COMPONENTS
// ======================
export const LazySettingsContent = dynamic(
  () => import('@/components/settings').then(mod => ({ default: mod.SettingsContent })),
  {
    loading: () => <div className="space-y-6">
      <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>,
  }
)

export const LazyDeleteAccountDialog = dynamic(
  () => import('@/components/settings').then(mod => ({ default: mod.DeleteAccountDialog })),
  {
    loading: () => null,
  }
)

export const LazyAccountInfo = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.AccountInfo })),
  {
    loading: () => <div className="h-32 bg-muted rounded animate-pulse" />,
  }
)

export const LazyPasswordForm = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.PasswordForm })),
  {
    loading: () => <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-muted rounded animate-pulse" />
      ))}
    </div>,
  }
)

export const LazyDangerZone = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.DangerZone })),
  {
    loading: () => <div className="h-48 bg-muted rounded animate-pulse" />,
  }
)

export const LazySecurityLog = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.SecurityLog })),
  {
    loading: () => <div className="space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-20 bg-muted rounded animate-pulse" />
      ))}
    </div>,
  }
)

// ======================
// AUTH COMPONENTS
// ======================
export const LazyLoginForm = dynamic(
  () => import('@/components/auth').then(mod => ({ default: mod.LoginForm })),
  {
    loading: () => <div className="space-y-4">
      <div className="h-10 bg-muted rounded animate-pulse" />
      <div className="h-10 bg-muted rounded animate-pulse" />
      <div className="h-10 bg-muted rounded animate-pulse" />
    </div>,
  }
)

export const LazyRegisterForm = dynamic(
  () => import('@/components/auth').then(mod => ({ default: mod.RegisterForm })),
  {
    loading: () => <div className="space-y-4">
      <div className="h-10 bg-muted rounded animate-pulse" />
      <div className="h-10 bg-muted rounded animate-pulse" />
      <div className="h-10 bg-muted rounded animate-pulse" />
    </div>,
  }
)



// ======================
// HOME COMPONENTS
// ======================
export const LazyHomeTrendingQuizzes = dynamic(
  () => import('@/components/home').then(mod => ({ default: mod.HomeTrendingQuizzes })),
  {
    loading: () => <div className="space-y-4">
      <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>,
  }
)

export const LazyHomeFeatures = dynamic(
  () => import('@/components/home').then(mod => ({ default: mod.HomeFeatures })),
  {
    loading: () => <div className="h-96 bg-muted rounded animate-pulse" />,
  }
)

export const LazyHomeQuickActions = dynamic(
  () => import('@/components/home').then(mod => ({ default: mod.HomeQuickActions })),
  {
    loading: () => <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-24 bg-muted rounded animate-pulse" />
      ))}
    </div>,
  }
)

// ======================
// FEATURE COMPONENTS
// ======================
export const LazyErrorBoundary = dynamic(
  () => import('@/components/optimized-error-boundary').then(mod => ({ default: mod.OptimizedErrorBoundary })),
  {
    ssr: true,
  }
)

// ======================
// FRAMER MOTION COMPONENTS
// ======================
export const LazyMotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  {
    ssr: false,
  }
)

export const LazyAnimatePresence = dynamic(
  () => import('framer-motion').then(mod => mod.AnimatePresence),
  {
    ssr: false,
  }
)

// ======================
// UTILITY FUNCTIONS
// ======================

// Generic loading wrapper with Suspense
export const withSuspense = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  )
  WrappedComponent.displayName = `withSuspense(${Component.displayName || Component.name || 'Component'})`
  return WrappedComponent
}

// Preload critical components for better perceived performance
export const preloadCriticalComponents = () => {
  const preloadPromises = [
    import('@/components/ui/button'),
    import('@/components/ui/card'),
    import('@/components/ui/input'),
    import('@/components/ui/dialog'),
    import('@/components/ui/toast'),
    import('@/components/ui/avatar'),
    import('@/components/ui/dropdown-menu'),
  ]
  
  return Promise.all(preloadPromises)
}

// Preload dashboard-specific components
export const preloadDashboardComponents = () => {
  const preloadPromises = [
    import('@/components/dashboard'),
    import('@/components/ui/tabs'),
    import('@/components/ui/badge'),
  ]
  
  return Promise.all(preloadPromises)
}

// Preload quiz-related components
export const preloadQuizComponents = () => {
  const preloadPromises = [
    import('@/components/quiz'),
    import('@/components/ui/progress'),
    import('@/components/ui/radio-group'),
  ]
  
  return Promise.all(preloadPromises)
}

// Preload explore page components
export const preloadExploreComponents = () => {
  const preloadPromises = [
    import('@/components/explore'),
    import('@/components/ui/pagination'),
  ]
  
  return Promise.all(preloadPromises)
}

// Preload auth components
export const preloadAuthComponents = () => {
  const preloadPromises = [
    import('@/components/auth'),
    import('@/components/ui/form'),
  ]
  
  return Promise.all(preloadPromises)
}

// Lazy load with intersection observer for viewport-based loading
export const lazyWithViewport = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  return dynamic(importFn, {
    loading: () => <>{fallback || <LoadingSpinner />}</>,
    ssr: false,
  })
}

// Batch preload multiple components
export const batchPreload = (importFns: Array<() => Promise<any>>) => {
  return Promise.allSettled(importFns.map(fn => fn()))
}

// Progressive enhancement wrapper
export const withProgressiveEnhancement = <P extends object>(
  Component: ComponentType<P>,
  FallbackComponent: ComponentType<P>
) => {
  const EnhancedComponent = (props: P) => {
    if (typeof window === 'undefined') {
      return <FallbackComponent {...props} />
    }
    return (
      <Suspense fallback={<FallbackComponent {...props} />}>
        <Component {...props} />
      </Suspense>
    )
  }
  EnhancedComponent.displayName = `withProgressiveEnhancement(${Component.displayName || Component.name})`
  return EnhancedComponent
}
