"use client"

import Link from "next/link"
import { GradientButton } from "@/components/ui/gradient-button"
import { Section } from "@/components/section"

export function ExploreHeader() {
  return (
    <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="animate-fade-up">
            <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
              Explore Quizzes
            </h1>
            <p className="responsive-text text-muted-foreground mt-1">Discover and practice quizzes created by the community</p>
          </div>
          <div className="animate-fade-up animate-delay-200">
            <GradientButton asChild className="w-full sm:w-auto touch-target">
              <Link href="/dashboard/create">Create Your Own Quiz</Link>
            </GradientButton>
          </div>
        </div>
      </div>
    </Section>
  )
} 