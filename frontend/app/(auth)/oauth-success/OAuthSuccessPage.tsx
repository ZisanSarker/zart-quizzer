"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Sparkles, ArrowRight, Brain, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { LottieAnimation } from "@/components/lottie-animation"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

// Import the Product Promotion animation
import productPromotionAnimation from "@/public/Product Promotion.json"

export default function OAuthSuccessPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { toast } = useToast()
  const [isSuccess, setIsSuccess] = useState(false)
  const { refreshUser } = useAuth()

  useEffect(() => {
    // We rely on secure HttpOnly cookies set by the backend during OAuth callback.
    // Never write tokens from query params to client cookies.
    const accessToken = params.get("accessToken")
    const refreshToken = params.get("refreshToken")

    if (accessToken && refreshToken) {
      // Show success state
      setIsSuccess(true)
      
      // Show welcome toast with emoji
      toast({
        title: "Welcome back! 🎉",
        description: "You've been logged in successfully.",
      })

      // Ensure cookies are written, refresh user, then redirect immediately
      const goTimer = setTimeout(async () => {
        try {
          await refreshUser()
        } finally {
          router.replace("/")
        }
      }, 150)

      return () => clearTimeout(goTimer)
    } else {
      router.replace("/login")
    }
  }, [params, router, toast])

  if (!isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-primary-950/30 dark:to-background">
        <div className="flex flex-col items-center gap-6 p-8 rounded-3xl shadow-xl bg-white/90 dark:bg-slate-900/80">
          <div className="animate-spin text-5xl mb-2">
            <Brain className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight flex gap-2 items-center">
            Logging you in...
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </h1>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-muted-foreground text-base">
              Please wait while we prepare your dashboard
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 dark:from-primary-950/30 dark:via-background dark:to-background">
      <Section className="py-8 sm:py-12 lg:py-16">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
            {/* Left Side - Success Content */}
            <div className="w-full lg:w-[60%] animate-fade-up">
              <div className="text-center lg:text-left">
                {/* Success Icon */}
                <div className="flex justify-center lg:justify-start mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-bounce">
                      <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-fade-up animate-delay-200">
                  Welcome Back! 🎉
                </h1>

                {/* Subtitle */}
                <p className="text-xl sm:text-2xl text-muted-foreground mb-6 animate-fade-up animate-delay-300">
                  You've been successfully logged in and we're preparing your personalized experience.
                </p>

                {/* Features List */}
                <div className="space-y-4 mb-8 animate-fade-up animate-delay-400">
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <span>AI-powered quiz generation</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <span>Personalized learning dashboard</span>
                  </div>
                                     <div className="flex items-center gap-3 text-lg">
                     <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                       <Sparkles className="w-4 h-4 text-primary" />
                     </div>
                     <span>Advanced analytics and insights</span>
                   </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-delay-500">
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <GradientButton size="lg" className="gap-2 w-full sm:w-auto">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </GradientButton>
                  </Link>
                  <Link href="/explore" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Explore Quizzes
                    </Button>
                  </Link>
                </div>

                {/* Immediate redirect, no countdown */}
              </div>
            </div>

            {/* Right Side - Lottie Animation */}
            <div className="w-full lg:w-[40%] flex justify-center animate-fade-in animate-delay-200">
              <div className="w-full max-w-lg h-96">
                <LottieAnimation 
                  animationData={productPromotionAnimation}
                  className="w-full h-full"
                  loop={true}
                  autoplay={true}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Additional Features Section */}
      <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-3xl font-bold text-center mb-8 animate-fade-up">
            What's Next?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up animate-delay-300">
            <div className="bg-card rounded-lg p-6 shadow-soft border border-border/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Your First Quiz</h3>
              <p className="text-muted-foreground">
                Use AI to generate personalized quizzes on any topic you want to learn.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-soft border border-border/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Explore Public Quizzes</h3>
              <p className="text-muted-foreground">
                Discover quizzes created by our community and test your knowledge.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-soft border border-border/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Your Progress</h3>
              <p className="text-muted-foreground">
                Monitor your learning journey with detailed analytics and insights.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}