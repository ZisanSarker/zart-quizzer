"use client"

import { CheckCircle, Lightbulb, Users } from "lucide-react"
import { Section } from "@/components/section"
import { ResponsiveGrid, ResponsiveGridLayouts } from "@/components/responsive-grid"

export function HomeFeatures() {
  const features = [
    {
      icon: CheckCircle,
      title: "AI-Powered Quiz Generation",
      description: "Create custom quizzes on any topic with our advanced AI. Specify quiz type, difficulty, and more."
    },
    {
      icon: Lightbulb,
      title: "Voice Command Integration",
      description: "Generate quizzes using voice commands for a hands-free experience."
    },
    {
      icon: Users,
      title: "Detailed Feedback",
      description: "Receive comprehensive feedback on your performance with explanations for each answer."
    }
  ]

  return (
    <Section className="py-12 sm:py-16 lg:py-20 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <h2 className="responsive-heading-2 gradient-heading text-center mb-8 sm:mb-12">Key Features</h2>
        <ResponsiveGrid cols={ResponsiveGridLayouts.standard}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg shadow-soft card-hover animate-fade-up mobile-card"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="rounded-full bg-primary-100 p-3 sm:p-4 mb-3 sm:mb-4">
                  <IconComponent className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                </div>
                <h3 className="responsive-heading-3 mb-2">{feature.title}</h3>
                <p className="responsive-text-small text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </ResponsiveGrid>
      </div>
    </Section>
  )
} 