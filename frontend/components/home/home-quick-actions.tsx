"use client"

import Link from "next/link"
import { Plus, BookOpen, Users } from "lucide-react"
import { Section } from "@/components/section"
import { LottieAnimation } from "@/components/lottie-animation"
import examsAnimation from "@/public/Exams.json"

export function HomeQuickActions() {
  return (
    <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
          {/* Left Side - Triangle Navigation */}
          <div className="w-full lg:w-[60%] animate-fade-up">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="responsive-heading-2 gradient-heading">Quick Actions</h2>
            </div>
            
            {/* Triangle Structure - Responsive */}
            <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Triangle Container */}
              <div className="relative w-full h-full">
                {/* Top Option */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                  <Link href="/dashboard/create" className="group">
                    <div className="flex flex-col items-center p-3 sm:p-5 bg-card/80 backdrop-blur-sm rounded-lg shadow-soft border-2 border-border/50 group-hover:border-primary/30 group-hover:bg-card/90 transition-all duration-300 w-28 h-24 sm:w-36 sm:h-32 opacity-100 animate-fade-up">
                      <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 mb-2 sm:mb-3 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors group-hover:rotate-icon">
                        <Plus className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h3 className="responsive-heading-3 mb-1 text-xs sm:text-sm text-center text-foreground">Create Quiz</h3>
                      <p className="responsive-text-small text-muted-foreground text-xs text-center">
                        Generate with AI
                      </p>
                    </div>
                  </Link>
                </div>
                
                {/* Bottom Left Option */}
                <div className="absolute bottom-0 left-0">
                  <Link href="/explore" className="group">
                    <div className="flex flex-col items-center p-3 sm:p-5 bg-card/80 backdrop-blur-sm rounded-lg shadow-soft border-2 border-border/50 group-hover:border-primary/30 group-hover:bg-card/90 transition-all duration-300 w-28 h-24 sm:w-36 sm:h-32 opacity-100 animate-fade-up animate-delay-200">
                      <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 mb-2 sm:mb-3 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors group-hover:rotate-icon">
                        <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h3 className="responsive-heading-3 mb-1 text-xs sm:text-sm text-center text-foreground">Explore</h3>
                      <p className="responsive-text-small text-muted-foreground text-xs text-center">
                        Public quizzes
                      </p>
                    </div>
                  </Link>
                </div>
                
                {/* Bottom Right Option */}
                <div className="absolute bottom-0 right-0">
                  <Link href="/dashboard" className="group">
                    <div className="flex flex-col items-center p-3 sm:p-5 bg-card/80 backdrop-blur-sm rounded-lg shadow-soft border-2 border-border/50 group-hover:border-primary/30 group-hover:bg-card/90 transition-all duration-300 w-28 h-24 sm:w-36 sm:h-32 opacity-100 animate-fade-up animate-delay-300">
                      <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 mb-2 sm:mb-3 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors group-hover:rotate-icon">
                        <Users className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h3 className="responsive-heading-3 mb-1 text-xs sm:text-sm text-center text-foreground">Dashboard</h3>
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
            <div className="w-full max-w-lg h-64 sm:h-80">
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