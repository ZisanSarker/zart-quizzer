"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Section } from "@/components/section"
import { LottieAnimation } from "@/components/lottie-animation"
import examsAnimation from "@/public/Exams.json"

export function HomeHero() {
  return (
    <Section className="py-12 sm:py-16 lg:py-20 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
          <div className="w-full lg:w-[70%] text-center lg:text-left animate-fade-up">
            <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6 font-playfair-display-sc">
              Create, Practice, and Master Quizzes with AI
            </h1>
            <div className="animate-fade-up animate-delay-200">
              <p className="responsive-text text-muted-foreground max-w-[600px] mb-6 sm:mb-8">
                Generate personalized quizzes on any topic, practice with voice commands, and track your progress with
                detailed feedback. Experience interactive learning with real-time animations and dynamic content.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up animate-delay-300 w-full sm:w-auto lg:justify-start">
              <Link href="/register" className="w-full sm:w-auto">
                <GradientButton size="lg" className="gap-2 w-full sm:w-auto touch-target">
                  Get Started <ArrowRight className="h-4 w-4" />
                </GradientButton>
              </Link>
              <Link href="/explore" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="transition-all duration-300 hover:border-primary-300 w-full sm:w-auto touch-target">
                  Explore Quizzes
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-[30%] flex justify-center animate-fade-in animate-delay-200">
            <div className="w-full max-w-lg h-96">
              <LottieAnimation 
                animationData={examsAnimation}
                className="w-full h-full"
                loop={true}
                autoplay={true}
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
} 