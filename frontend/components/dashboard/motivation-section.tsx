"use client"

import Link from "next/link"
import { GradientButton } from "@/components/ui/gradient-button"
import { Section } from "@/components/section"
import { LottieAnimation } from "@/components/lottie-animation"
import { Plus } from "lucide-react"
import type { UserStats } from "@/types/stats"

interface MotivationSectionProps {
  stats: UserStats | null
}

export function MotivationSection({ stats }: MotivationSectionProps) {
  return (
    <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Left Side - Lottie Animation */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-64 h-64 sm:w-80 sm:h-80 bg-muted/20 rounded-lg border border-border/50 flex items-center justify-center">
              <LottieAnimation 
                animationPath="/business-ideas.json"
                loop={true}
                autoplay={true}
              />
            </div>
          </div>

          {/* Right Side - Motivation Content */}
          <div className="text-center lg:text-left space-y-4 sm:space-y-6">
            <div className="animate-fade-up">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Keep Learning, Keep Growing
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
                Every quiz you create and complete brings you one step closer to mastering new skills. 
                Your dedication to learning is what sets you apart.
              </p>
            </div>

            <div className="animate-fade-up animate-delay-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-2">
                    {stats?.quizzesCreated ?? 0}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Quizzes Created
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-2">
                    {stats?.quizzesCompleted ?? 0}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Quizzes Completed
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-up animate-delay-400">
              <GradientButton asChild className="w-full sm:w-auto">
                <Link href="/dashboard/create">
                  <Plus className="mr-2 h-4 w-4" /> Create Your Next Quiz
                </Link>
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
} 