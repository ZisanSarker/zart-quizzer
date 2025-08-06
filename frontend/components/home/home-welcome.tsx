"use client"

import { Section } from "@/components/section"

interface HomeWelcomeProps {
  username?: string
}

export function HomeWelcome({ username }: HomeWelcomeProps) {
  return (
    <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="animate-fade-up">
            <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
              Welcome back{username ? `, ${username}` : ""}! 👋
            </h1>
          </div>
          <div className="animate-fade-up animate-delay-200">
            <p className="responsive-text text-muted-foreground max-w-[800px] mb-6 sm:mb-8">
              Ready to continue your learning journey? Here's what's happening in your quiz world.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
} 