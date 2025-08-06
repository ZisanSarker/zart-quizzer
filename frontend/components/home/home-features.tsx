"use client"

import { CheckCircle, Lightbulb, Users } from "lucide-react"
import { Section } from "@/components/section"
import { ResponsiveGrid, ResponsiveGridLayouts } from "@/components/responsive-grid"

export function HomeFeatures() {
  return (
    <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <h2 className="responsive-heading-2 gradient-heading text-center mb-8">Key Features</h2>
        <ResponsiveGrid cols={ResponsiveGridLayouts.standard}>
          <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up mobile-card">
            <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-3 sm:p-4 mb-3 sm:mb-4">
              <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
            </div>
            <h3 className="responsive-heading-3 mb-2 text-foreground">AI-Powered Quiz Generation</h3>
            <p className="responsive-text-small text-muted-foreground">
              Create custom quizzes on any topic with our advanced AI. Specify quiz type, difficulty, and more.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up animate-delay-200 mobile-card">
            <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-3 sm:p-4 mb-3 sm:mb-4">
              <Lightbulb className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
            </div>
            <h3 className="responsive-heading-3 mb-2 text-foreground">Voice Command Integration</h3>
            <p className="responsive-text-small text-muted-foreground">
              Generate quizzes using voice commands for a hands-free experience.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up animate-delay-300 mobile-card">
            <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-3 sm:p-4 mb-3 sm:mb-4">
              <Users className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
            </div>
            <h3 className="responsive-heading-3 mb-2 text-foreground">Detailed Feedback</h3>
            <p className="responsive-text-small text-muted-foreground">
              Receive comprehensive feedback on your performance with explanations for each answer.
            </p>
          </div>
        </ResponsiveGrid>
      </div>
    </Section>
  )
} 