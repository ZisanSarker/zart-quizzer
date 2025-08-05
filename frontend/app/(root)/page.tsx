"use client"

import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { ArrowRight, CheckCircle, Lightbulb, Users } from "lucide-react"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { ResponsiveGrid, ResponsiveGridLayouts } from "@/components/responsive-grid"
import { AnimatedGallery } from "@/components/animated-gallery"

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  return (
    <>
      {isAuthenticated ? (
        <PageContainer>
          <Section>
            <div className="container flex flex-col items-center text-center max-w-6xl">
              <div className="animate-fade-up">
                <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
                  Welcome back{user?.username ? `, ${user.username}` : ""}!
                </h1>
              </div>
              <div className="animate-fade-up animate-delay-200">
                <p className="responsive-text text-muted-foreground max-w-[800px] mb-6 sm:mb-8">
                  Ready to continue your learning journey? Pick up where you left off, explore new quizzes, or check your progress.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up animate-delay-300 w-full sm:w-auto">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <GradientButton size="lg" className="gap-2 w-full sm:w-auto touch-target">
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </GradientButton>
                </Link>
                <Link href="/explore" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="transition-all duration-300 hover:border-primary-300 w-full sm:w-auto touch-target">
                    Explore Quizzes
                  </Button>
                </Link>
              </div>
            </div>
          </Section>

          <Section className="py-12 sm:py-16 lg:py-20 bg-muted/50">
            <div className="container max-w-6xl">
              <h2 className="responsive-heading-2 gradient-heading text-center mb-8 sm:mb-12">Your Recent Activity</h2>
              {/* Example: Replace with real data */}
              <ResponsiveGrid cols={ResponsiveGridLayouts.standard}>
                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up mobile-card">
                  <div className="rounded-full bg-primary-100 p-3 sm:p-4 mb-3 sm:mb-4">
                    <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                  </div>
                  <h3 className="responsive-heading-3 mb-2">Last Quiz Attempted</h3>
                  <p className="responsive-text-small text-muted-foreground">
                    "Mathematics - Calculus" <br /> Score: 8/10
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up animate-delay-200 mobile-card">
                  <div className="rounded-full bg-primary-100 p-3 sm:p-4 mb-3 sm:mb-4">
                    <Lightbulb className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                  </div>
                  <h3 className="responsive-heading-3 mb-2">Suggested Quiz</h3>
                  <p className="responsive-text-small text-muted-foreground">
                    "Science - Quantum Physics"
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up animate-delay-300 mobile-card">
                  <div className="rounded-full bg-primary-100 p-3 sm:p-4 mb-3 sm:mb-4">
                    <Users className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                  </div>
                  <h3 className="responsive-heading-3 mb-2">Community Highlight</h3>
                  <p className="responsive-text-small text-muted-foreground">
                    "World History" quiz is trending!
                  </p>
                </div>
              </ResponsiveGrid>
            </div>
          </Section>
        </PageContainer>
      ) : (
        <PageContainer>
          <Section>
            <div className="container flex flex-col items-center text-center max-w-6xl">
              <div className="animate-fade-up">
                <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
                  Create, Practice, and Master Quizzes with AI
                </h1>
              </div>
              <div className="animate-fade-up animate-delay-200">
                <p className="responsive-text text-muted-foreground max-w-[800px] mb-6 sm:mb-8">
                  Generate personalized quizzes on any topic, practice with voice commands, and track your progress with
                  detailed feedback.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up animate-delay-300 w-full sm:w-auto">
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
          </Section>

          <Section className="py-12 sm:py-16 lg:py-20">
            <div className="container max-w-6xl">
              <div className="flex justify-center animate-fade-up animate-delay-400">
                <AnimatedGallery className="max-w-4xl" />
              </div>
            </div>
          </Section>

          <Section className="py-12 sm:py-16 lg:py-20 bg-muted/50">
            <div className="container max-w-6xl">
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

          <Section className="py-12 sm:py-16 lg:py-20">
            <div className="container max-w-6xl">
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
        </PageContainer>
      )}
    </>
  )
}