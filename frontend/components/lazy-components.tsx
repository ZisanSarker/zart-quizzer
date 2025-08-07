import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/feedback'

// Lazy load heavy components
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

export const LazyChart = dynamic(
  () => import('@/components/ui/chart').then(mod => ({ default: mod.Chart })),
  {
    loading: () => <div className="w-full h-64 bg-muted rounded animate-pulse" />,
    ssr: false,
  }
)

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
  () => import('@/components/ui/resizable').then(mod => ({ default: mod.Resizable })),
  {
    loading: () => <div className="w-full h-64 bg-muted rounded animate-pulse" />,
    ssr: false,
  }
)

// Lazy load dashboard components
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

// Lazy load quiz components
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

// Lazy load explore components
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

// Lazy load profile components
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

// Lazy load settings components
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

// Lazy load auth components
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

// Lazy load home components
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

// Generic loading wrapper
export const withSuspense = (Component: React.ComponentType<any>, fallback?: React.ReactNode) => {
  return (props: any) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  )
}

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be needed soon
  const preloadPromises = [
    import('@/components/ui/button'),
    import('@/components/ui/card'),
    import('@/components/ui/input'),
    import('@/components/ui/dialog'),
  ]
  
  return Promise.all(preloadPromises)
}
