"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { generateQuiz } from "@/lib/quiz"
import { useAuth } from "@/contexts/auth-context"
import { Section } from "@/components/section"
import { QuizForm } from "@/components/dashboard/quiz-form"

export default function CreateQuizPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateQuiz = async (formData: any) => {
    setIsGenerating(true)
    try {
      const { topic, description, quizType, numberOfQuestions, difficulty, timeLimit, isPublic } = formData
      
      const response = await generateQuiz({
        topic,
        description,
        quizType: quizType as "multiple-choice" | "true-false" | "mixed",
        numberOfQuestions,
        difficulty: difficulty as "easy" | "medium" | "hard",
        timeLimit,
        isPublic,
      })
      
      toast({
        title: "Quiz generated successfully",
        description: "Your quiz is ready to be taken or shared.",
      })
      router.push(`/dashboard/quiz/preview/${response.quiz._id}`)
    } catch (error: any) {
      console.error("Failed to generate quiz:", error)
      toast({
        title: "Failed to generate quiz",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Create Quiz Header Section */}
      <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="animate-fade-up">
              <h1 className="responsive-heading-1 gradient-heading mb-4 sm:mb-6">
                Create Quiz
              </h1>
            </div>
          </div>
        </div>
      </Section>

      {/* Create Quiz Form Section */}
      <Section className="py-6 sm:py-8 md:py-12 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="w-full flex flex-col items-center">
            <QuizForm
              onGenerate={handleGenerateQuiz}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </Section>
    </div>
  )
}