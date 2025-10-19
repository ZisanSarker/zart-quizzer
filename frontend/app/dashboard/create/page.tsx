"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { generateQuiz } from "@/lib/quiz"
import { useAuth } from "@/contexts/auth-context"
import { LazyQuizForm } from "@/components/lazy-components"
import { PageHeader, ContentSection } from "@/components/ui/layout"

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
      <PageHeader title="Create Quiz" />

      {/* Create Quiz Form Section */}
      <ContentSection>
        <div className="w-full flex flex-col items-center">
          <Suspense fallback={<div className="space-y-4 w-full">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>}>
            <LazyQuizForm
              onGenerate={handleGenerateQuiz}
              isGenerating={isGenerating}
            />
          </Suspense>
        </div>
      </ContentSection>
    </div>
  )
}