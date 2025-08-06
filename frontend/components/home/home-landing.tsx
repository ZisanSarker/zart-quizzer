"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Lightbulb, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Section } from "@/components/section"
import { ResponsiveGrid, ResponsiveGridLayouts } from "@/components/responsive-grid"
import { AnimatedGallery } from "@/components/animated-gallery"
import { LottieAnimation } from "@/components/lottie-animation"
import examsAnimation from "@/public/Exams.json"

export function HomeLanding() {
  return (
    <>
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

      <Section className="py-12 sm:py-16 lg:py-20 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="responsive-heading-2 gradient-heading text-center mb-8 sm:mb-12">Key Features</h2>
          <ResponsiveGrid cols={ResponsiveGridLayouts.standard}>
            <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up mobile-card">
              <div className="rounded-full bg-primary-100 p-3 sm:p-4 mb-3 sm:mb-4">
                <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
              </div>
              <h3 className="responsive-heading-3 mb-2">AI-Powered Quiz Generation</h3>
              <p className="responsive-text-small text-muted-foreground">
                Create custom quizzes on any topic with our advanced AI. Specify quiz type, difficulty, and more.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up animate-delay-200 mobile-card">
              <div className="rounded-full bg-primary-100 p-3 sm:p-4 mb-3 sm:mb-4">
                <Lightbulb className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
              </div>
              <h3 className="responsive-heading-3 mb-2">Voice Command Integration</h3>
              <p className="responsive-text-small text-muted-foreground">
                Generate quizzes using voice commands for a hands-free experience.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up animate-delay-300 mobile-card">
              <div className="rounded-full bg-primary-100 p-3 sm:p-4 mb-3 sm:mb-4">
                <Users className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
              </div>
              <h3 className="responsive-heading-3 mb-2">Detailed Feedback</h3>
              <p className="responsive-text-small text-muted-foreground">
                Receive comprehensive feedback on your performance with explanations for each answer.
              </p>
            </div>
          </ResponsiveGrid>
        </div>
      </Section>

      <Section className="py-16 sm:py-20 lg:py-24 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-center animate-fade-up animate-delay-400 -mt-12 sm:-mt-16 lg:-mt-20">
            <AnimatedGallery className="max-w-4xl" />
          </div>
        </div>
      </Section>

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
                  {[
                    "Mathematics - Calculus",
                    "History - World War II",
                    "Science - Quantum Physics",
                    "Literature - Shakespeare",
                  ].map((quiz, index) => (
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
    </>
  )
} 