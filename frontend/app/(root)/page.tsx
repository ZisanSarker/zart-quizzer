"use client"

import { Suspense, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useHomeData } from "@/hooks/use-home-data"
import { HomeWelcome } from "@/components/home/home-welcome"
import { Section } from "@/components/section"
import { LazyAnimatedGallery, LazyHomeTrendingQuizzes, LazyHomeQuickActions, LazyHomeFeatures } from "@/components/lazy-components"
import { useRoutePreloader, preloadAuthenticatedRoutes } from "@/lib/route-preloader"
import { useRouter } from "next/navigation"

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const { trendingQuizzes, loading, error } = useHomeData()
  const router = useRouter()
  const { prefetchRoute } = useRoutePreloader()

  // Prefetch likely routes based on authentication status
  useEffect(() => {
    // Use optimized route preloading
    preloadAuthenticatedRoutes(router, isAuthenticated)
    
    // Preload explore page (common for all users)
    prefetchRoute('/explore')
  }, [isAuthenticated, prefetchRoute, router])

  if (isAuthenticated) {
    return (
      <>
        <HomeWelcome username={user?.username} />
        <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (<div key={i} className="h-24 bg-muted rounded animate-pulse" />))}
        </div>}>
          <LazyHomeQuickActions />
        </Suspense>
        <Suspense fallback={<div className="h-96 bg-muted rounded animate-pulse" />}>
          <LazyHomeFeatures />
        </Suspense>
        <Section className="py-16 sm:py-20 lg:py-24 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
          <div className="container max-w-6xl">
            <div className="flex justify-center animate-fade-up animate-delay-400 -mt-12 sm:-mt-16 lg:-mt-20">
              <Suspense fallback={<div className="w-full h-64 bg-muted rounded animate-pulse" />}>
                <LazyAnimatedGallery className="max-w-4xl" />
              </Suspense>
            </div>
          </div>
        </Section>
        <Suspense fallback={<div className="w-full h-96 bg-muted rounded animate-pulse" />}>
          <LazyHomeTrendingQuizzes 
            trendingQuizzes={trendingQuizzes}
            loading={loading}
            error={error}
          />
        </Suspense>
      </>
    )
  }

  return (
    <>
      <HomeWelcome />
      <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (<div key={i} className="h-24 bg-muted rounded animate-pulse" />))}
      </div>}>
        <LazyHomeQuickActions />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-muted rounded animate-pulse" />}>
        <LazyHomeFeatures />
      </Suspense>
      <Section className="py-16 sm:py-20 lg:py-24 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-6xl">
          <div className="flex justify-center animate-fade-up animate-delay-400 -mt-12 sm:-mt-16 lg:-mt-20">
            <Suspense fallback={<div className="w-full h-64 bg-muted rounded animate-pulse" />}>
              <LazyAnimatedGallery className="max-w-4xl" />
            </Suspense>
          </div>
        </div>
      </Section>
      <Suspense fallback={<div className="w-full h-96 bg-muted rounded animate-pulse" />}>
        <LazyHomeTrendingQuizzes 
          trendingQuizzes={trendingQuizzes}
          loading={loading}
          error={error}
        />
      </Suspense>
    </>
  )
}