"use client"

import { useAuth } from "@/contexts/auth-context"
import HomeLayout from "@/components/home-layout"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { ArrowRight, CheckCircle, Lightbulb, Users } from "lucide-react"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { ResponsiveGrid } from "@/components/responsive-grid"

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  return (
    <HomeLayout>
      {isAuthenticated ? (
        <PageContainer>
          <Section>
            <div className="container flex flex-col items-center text-center max-w-6xl">
              <div className="animate-fade-up">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 gradient-heading">
                  Welcome back{user?.username ? `, ${user.username}` : ""}!
                </h1>
              </div>
              <div className="animate-fade-up animate-delay-200">
                <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mb-8">
                  Ready to continue your learning journey? Pick up where you left off, explore new quizzes, or check your progress.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-delay-300">
                <Link href="/dashboard">
                  <GradientButton size="lg" className="gap-2">
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </GradientButton>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="transition-all duration-300 hover:border-primary-300">
                    Explore Quizzes
                  </Button>
                </Link>
              </div>
            </div>
          </Section>

          <Section className="py-20 bg-muted/50">
            <div className="container max-w-6xl">
              <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 gradient-heading">Your Recent Activity</h2>
              {/* Example: Replace with real data */}
              <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }}>
                <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up">
                  <div className="rounded-full bg-primary-100 p-4 mb-4">
                    <CheckCircle className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Last Quiz Attempted</h3>
                  <p className="text-muted-foreground">
                    "Mathematics - Calculus" <br /> Score: 8/10
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up animate-delay-200">
                  <div className="rounded-full bg-primary-100 p-4 mb-4">
                    <Lightbulb className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Suggested Quiz</h3>
                  <p className="text-muted-foreground">
                    "Science - Quantum Physics"
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up animate-delay-300">
                  <div className="rounded-full bg-primary-100 p-4 mb-4">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Community Highlight</h3>
                  <p className="text-muted-foreground">
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
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 gradient-heading">
                  Create, Practice, and Master Quizzes with AI
                </h1>
              </div>
              <div className="animate-fade-up animate-delay-200">
                <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mb-8">
                  Generate personalized quizzes on any topic, practice with voice commands, and track your progress with
                  detailed feedback.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-delay-300">
                <Link href="/register">
                  <GradientButton size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </GradientButton>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="transition-all duration-300 hover:border-primary-300">
                    Explore Quizzes
                  </Button>
                </Link>
              </div>
            </div>
          </Section>

          <Section className="py-20 bg-muted/50">
            <div className="container max-w-6xl">
              <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 gradient-heading">Key Features</h2>
              <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }}>
                <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up">
                  <div className="rounded-full bg-primary-100 p-4 mb-4">
                    <CheckCircle className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">AI-Powered Quiz Generation</h3>
                  <p className="text-muted-foreground">
                    Create custom quizzes on any topic with our advanced AI. Specify quiz type, difficulty, and more.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up animate-delay-200">
                  <div className="rounded-full bg-primary-100 p-4 mb-4">
                    <Lightbulb className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Voice Command Integration</h3>
                  <p className="text-muted-foreground">
                    Generate quizzes using voice commands for a hands-free experience.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up animate-delay-300">
                  <div className="rounded-full bg-primary-100 p-4 mb-4">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Detailed Feedback</h3>
                  <p className="text-muted-foreground">
                    Receive comprehensive feedback on your performance with explanations for each answer.
                  </p>
                </div>
              </ResponsiveGrid>
            </div>
          </Section>

          <Section className="py-20">
            <div className="container max-w-6xl">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 animate-fade-in">
                  <h2 className="text-3xl font-bold tracking-tighter mb-6 gradient-heading">
                    Share and Practice with Others
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Explore a vast library of quizzes created by other users. Search by topic, difficulty, or quiz type
                    to find the perfect practice material.
                  </p>
                  <Link href="/explore">
                    <GradientButton className="gap-2">
                      Explore Public Quizzes <ArrowRight className="h-4 w-4" />
                    </GradientButton>
                  </Link>
                </div>
                <div className="flex-1 flex justify-center animate-fade-in animate-delay-200">
                  <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-soft border">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Public Quiz Library</h3>
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
                          className="p-3 bg-muted rounded-md flex justify-between items-center transition-all duration-300 hover:bg-primary-50 hover:text-primary-500 hover:shadow-sm"
                        >
                          <span>{quiz}</span>
                          <Lightbulb className="h-4 w-4 text-primary" />
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
    </HomeLayout>
  )
}