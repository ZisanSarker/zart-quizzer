"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { ArrowLeft, Home, Search, Sparkles, Navigation, Zap } from "lucide-react"
import { LottieAnimation } from "@/components/lottie-animation"
import { Section } from "@/components/section"
import Error404Animation from "@/public/Error 404.json"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-accent/5 rounded-full blur-2xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <Section className="py-8 sm:py-12">
          <div className="container max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              
              {/* Left Side - Animation */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150"></div>
                  
                  {/* Animation Container */}
                  <div className="relative w-full max-w-lg h-96 animate-fade-up">
                    <LottieAnimation 
                      animationData={Error404Animation}
                      className="w-full h-full"
                      loop={true}
                      autoplay={true}
                    />
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/30 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left animate-fade-up animate-delay-200">
                
                {/* Error Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-medium mb-6 animate-fade-up animate-delay-100">
                  <Sparkles className="h-4 w-4" />
                  Page Not Found
                </div>

                {/* Main Error Message */}
                <div className="mb-8">
                  <h1 className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-up animate-delay-200">
                    404
                  </h1>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 animate-fade-up animate-delay-300">
                    Oops! Lost in Space?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-[500px] leading-relaxed animate-fade-up animate-delay-400">
                    The page you're looking for seems to have floated away into the digital cosmos. 
                    Don't worry, we've got plenty of amazing quizzes waiting for you!
                  </p>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-fade-up animate-delay-500">
                  <Link href="/" className="group">
                    <div className="p-6 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Home className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground">Go Home</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Return to the main dashboard</p>
                    </div>
                  </Link>

                  <Link href="/explore" className="group">
                    <div className="p-6 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Search className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground">Explore Quizzes</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Discover amazing quizzes</p>
                    </div>
                  </Link>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-up animate-delay-600">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                  </Button>
                  
                  <Link href="/dashboard/create">
                    <GradientButton size="lg" className="gap-2 group">
                      <Zap className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                      Create Quiz
                    </GradientButton>
                  </Link>
                </div>

                {/* Quick Links */}
                <div className="animate-fade-up animate-delay-700">
                  <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center lg:justify-start gap-2">
                    <Navigation className="h-4 w-4" />
                    Quick Navigation
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    {[
                      { href: "/dashboard", label: "Dashboard" },
                      { href: "/explore", label: "Explore" },
                      { href: "/dashboard/create", label: "Create" },
                      { href: "/dashboard/profile", label: "Profile" }
                    ].map((link, index) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="px-4 py-2 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-105 text-foreground hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
} 