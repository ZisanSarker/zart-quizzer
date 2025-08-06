"use client"

import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { Section } from "@/components/section"
import { Card, CardContent } from "@/components/ui/card"
import { LottieAnimation } from "@/components/lottie-animation"
import examsAnimation from "@/public/Exams.json"
import type { ExploreQuiz } from "@/types/quiz"

interface HomeTrendingQuizzesProps {
  trendingQuizzes: ExploreQuiz[]
  loading: boolean
  error: string | null
}

export function HomeTrendingQuizzes({ 
  trendingQuizzes, 
  loading, 
  error 
}: HomeTrendingQuizzesProps) {
  return (
    <Section className="py-8 sm:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
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
            {trendingQuizzes.map((quiz) => (
              <Card key={quiz._id} className="bg-card rounded-lg shadow-soft border border-border/50 hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
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
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {quiz.topic}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-4 leading-relaxed flex-grow">
                    {quiz.description || "Test your knowledge with this engaging quiz."}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
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
  )
} 