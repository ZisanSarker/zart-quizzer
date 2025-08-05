"use client"

import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { ArrowRight, CheckCircle, Lightbulb, Users, Plus, BookOpen, Star, Clock } from "lucide-react"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { ResponsiveGrid, ResponsiveGridLayouts } from "@/components/responsive-grid"
import { AnimatedGallery } from "@/components/animated-gallery"
import { LottieAnimation } from "@/components/lottie-animation"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import examsAnimation from "@/public/Exams.json"
import { getExploreQuizzes, getTrendingQuizzes } from "@/lib/quiz"
import type { ExploreQuiz } from "@/types/quiz"

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const [trendingQuizzes, setTrendingQuizzes] = useState<ExploreQuiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendingQuizzes = async () => {
      try {
        setLoading(true)
        const quizzes = await getTrendingQuizzes(3)
        setTrendingQuizzes(quizzes)
      } catch (err) {
        setError("Failed to fetch trending quizzes.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingQuizzes()
    const interval = setInterval(fetchTrendingQuizzes, 300000) // Fetch every 5 minutes
    return () => clearInterval(interval)
  }, [])

  if (isAuthenticated) {
    return (
      <PageContainer>
        {/* Welcome Section */}
        <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
          <div className="container flex flex-col items-center text-center max-w-6xl">
            <div className="animate-fade-up">
              <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
                Welcome back{user?.username ? `, ${user.username}` : ""}! 👋
              </h1>
            </div>
            <div className="animate-fade-up animate-delay-200">
              <p className="responsive-text text-muted-foreground max-w-[800px] mb-6 sm:mb-8">
                Ready to continue your learning journey? Here's what's happening in your quiz world.
              </p>
            </div>
          </div>
        </Section>

        {/* Triangle Navigation with Lottie Animation */}
        <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
          <div className="container max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
              {/* Left Side - Triangle Navigation */}
              <div className="w-full lg:w-[60%] animate-fade-up">
                <div className="text-center mb-8">
                  <h2 className="responsive-heading-2 gradient-heading">Quick Actions</h2>
                </div>
                
                {/* Triangle Structure */}
                <div className="relative mx-auto w-80 h-80 flex items-center justify-center">
                  {/* Triangle Container */}
                  <div className="relative w-full h-full">
                    {/* Top Option */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                      <Link href="/dashboard/create" className="group">
                        <div className="flex flex-col items-center p-5 bg-card/80 backdrop-blur-sm rounded-lg shadow-soft border-2 border-border/50 group-hover:border-primary/30 group-hover:bg-card/90 transition-all duration-300 w-36 h-32 opacity-100 animate-fade-up">
                          <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-3 mb-3 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors group-hover:rotate-icon">
                            <Plus className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="responsive-heading-3 mb-1 text-sm text-center text-foreground">Create Quiz</h3>
                          <p className="responsive-text-small text-muted-foreground text-xs text-center">
                            Generate with AI
                          </p>
                        </div>
                      </Link>
                    </div>
                    
                    {/* Bottom Left Option */}
                    <div className="absolute bottom-0 left-0">
                      <Link href="/explore" className="group">
                        <div className="flex flex-col items-center p-5 bg-card/80 backdrop-blur-sm rounded-lg shadow-soft border-2 border-border/50 group-hover:border-primary/30 group-hover:bg-card/90 transition-all duration-300 w-36 h-32 opacity-100 animate-fade-up animate-delay-200">
                          <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-3 mb-3 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors group-hover:rotate-icon">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="responsive-heading-3 mb-1 text-sm text-center text-foreground">Explore</h3>
                          <p className="responsive-text-small text-muted-foreground text-xs text-center">
                            Public quizzes
                          </p>
                        </div>
                      </Link>
                    </div>
                    
                    {/* Bottom Right Option */}
                    <div className="absolute bottom-0 right-0">
                      <Link href="/dashboard" className="group">
                        <div className="flex flex-col items-center p-5 bg-card/80 backdrop-blur-sm rounded-lg shadow-soft border-2 border-border/50 group-hover:border-primary/30 group-hover:bg-card/90 transition-all duration-300 w-36 h-32 opacity-100 animate-fade-up animate-delay-300">
                          <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-3 mb-3 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors group-hover:rotate-icon">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="responsive-heading-3 mb-1 text-sm text-center text-foreground">Dashboard</h3>
                          <p className="responsive-text-small text-muted-foreground text-xs text-center">
                            Manage progress
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Lottie Animation */}
              <div className="w-full lg:w-[40%] flex justify-center animate-fade-in animate-delay-200">
                <div className="w-full max-w-lg h-80">
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

        {/* Key Features */}
        <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
          <div className="container max-w-7xl">
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

        {/* Animated Gallery */}
        <Section className="py-16 sm:py-20 lg:py-24 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
          <div className="container max-w-7xl">
            <div className="flex justify-center animate-fade-up animate-delay-400 -mt-12 sm:-mt-16 lg:-mt-20">
              <AnimatedGallery className="max-w-4xl" />
            </div>
          </div>
        </Section>

        {/* Trending Quizzes Section */}
        <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
          <div className="container max-w-7xl">
            <div className="text-center mb-8 animate-fade-up">
              <h2 className="responsive-heading-2 gradient-heading mb-4">Trending Quizzes</h2>
              <p className="responsive-text text-muted-foreground max-w-[600px] mx-auto">
                Discover the most popular quizzes created by our community. Start practicing with these trending topics!
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LottieAnimation 
                  animationData={examsAnimation}
                  className="w-24 h-24"
                  loop={true}
                  autoplay={true}
                />
                <p className="ml-4 text-muted-foreground">Loading trending quizzes...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-muted-foreground">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up animate-delay-200">
                {trendingQuizzes.map((quiz, index) => (
                  <Card key={quiz._id} className="bg-card rounded-lg shadow-soft border border-border/50 hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">{quiz.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">Trending</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {quiz.topic}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {quiz.description || "Test your knowledge with this engaging quiz."}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>📊 {quiz.attempts || 0} attempts</span>
                          <span>⭐ {quiz.rating ? quiz.rating.toFixed(1) : "0.0"}/5</span>
                        </div>
                        <Link href={`/dashboard/quiz/practice/${quiz._id}`} className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                          Start Quiz →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="text-center mt-8 animate-fade-up animate-delay-300">
              <Link href="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                View All Trending Quizzes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Section>
      </PageContainer>
    )
  }

  // Unauthenticated user landing page
  return (
    <PageContainer>
      <Section className="py-12 sm:py-16 lg:py-20 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl">
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
        <div className="container max-w-7xl">
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
        <div className="container max-w-7xl">
          <div className="flex justify-center animate-fade-up animate-delay-400 -mt-12 sm:-mt-16 lg:-mt-20">
            <AnimatedGallery className="max-w-4xl" />
          </div>
        </div>
      </Section>

      <Section className="py-12 sm:py-16 lg:py-20 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl">
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
  )
}