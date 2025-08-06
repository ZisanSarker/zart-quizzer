"use client"

import { useAuth } from "@/contexts/auth-context"
import { useHomeData } from "@/hooks/use-home-data"
import { HomeWelcome } from "@/components/home/home-welcome"
import { HomeQuickActions } from "@/components/home/home-quick-actions"
import { HomeFeatures } from "@/components/home/home-features"
import { HomeTrendingQuizzes } from "@/components/home/home-trending-quizzes"
import { HomeLanding } from "@/components/home/home-landing"
import { AnimatedGallery } from "@/components/animated-gallery"
import { Section } from "@/components/section"

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const { trendingQuizzes, loading, error } = useHomeData()

  if (isAuthenticated) {
    return (
      <>
        <HomeWelcome username={user?.username} />
        <HomeQuickActions />
        <HomeFeatures />
        <Section className="py-16 sm:py-20 lg:py-24 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
          <div className="container max-w-6xl">
            <div className="flex justify-center animate-fade-up animate-delay-400 -mt-12 sm:-mt-16 lg:-mt-20">
              <AnimatedGallery className="max-w-4xl" />
            </div>
          </div>
        </Section>
        <HomeTrendingQuizzes 
          trendingQuizzes={trendingQuizzes}
          loading={loading}
          error={error}
        />
      </>
    )
  }

  // Unauthenticated user landing page
  return <HomeLanding />
}