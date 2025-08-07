"use client"

import Link from "next/link"
import { ArrowRight, Users, Lightbulb } from "lucide-react"
import { GradientButton } from "@/components/ui/gradient-button"
import { Section } from "@/components/section"

export function HomeShareSection() {
  const sampleQuizzes = [
    "Mathematics - Calculus",
    "History - World War II",
    "Science - Quantum Physics",
    "Literature - Shakespeare",
  ]

  return (
    <Section className="py-12 sm:py-16 lg:py-20 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
          <div className="flex-1 animate-fade-in">
            <h2 className="responsive-heading-2 gradient-heading mb-4 sm:mb-6">
              Share and Practice with Others
            </h2>
            <p className="responsive-text text-muted-foreground mb-6">
              Explore a vast library of quizzes created by other users. Search by topic, difficulty, or quiz type
              to find the perfect practice material.
            </p>
            <Link href="/explore">
              <GradientButton className="gap-2 touch-target">
                Explore Public Quizzes <ArrowRight className="h-4 w-4" />
              </GradientButton>
            </Link>
          </div>
          <div className="flex-1 flex justify-center animate-fade-in animate-delay-200">
            <div className="w-full max-w-md p-4 sm:p-6 bg-card rounded-lg shadow-soft border mobile-card">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold responsive-heading-3">Public Quiz Library</h3>
              </div>
              <div className="space-y-3">
                {sampleQuizzes.map((quiz, index) => (
                  <div
                    key={index}
                    className="p-3 bg-muted rounded-md flex justify-between items-center transition-all duration-300 hover:bg-primary-50 hover:text-primary-500 hover:shadow-sm touch-target"
                  >
                    <span className="responsive-text-small">{quiz}</span>
                    <Lightbulb className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
} 