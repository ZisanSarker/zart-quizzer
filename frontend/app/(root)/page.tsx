"use client"

import { Suspense } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useHomeData } from "@/hooks/use-home-data"
import { HomeWelcome } from "@/components/home/home-welcome"
import { HomeQuickActions } from "@/components/home/home-quick-actions"
import { HomeFeatures } from "@/components/home/home-features"
import { Section } from "@/components/section"
import { LazyAnimatedGallery, LazyHomeTrendingQuizzes } from "@/components/lazy-components"
import { usePerformanceOptimization } from "@/hooks/use-performance-optimization"
import { useEffect } from "react"

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const { trendingQuizzes, loading, error } = useHomeData()
  const { prefetchRoute } = usePerformanceOptimization()

  // Prefetch likely routes based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      prefetchRoute('/dashboard')
      prefetchRoute('/dashboard/create')
      prefetchRoute('/dashboard/library')
    } else {
      prefetchRoute('/login')
      prefetchRoute('/register')
    }
    prefetchRoute('/explore')
  }, [isAuthenticated, prefetchRoute])

  if (isAuthenticated) {
    return (
      <>
        <HomeWelcome username={user?.username} />
        <HomeQuickActions />
        <HomeFeatures />
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
      <HomeQuickActions />
      <HomeFeatures />
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