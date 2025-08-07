"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { generateQuiz } from "@/lib/quiz"
import { useAuth } from "@/contexts/auth-context"
import { QuizForm } from "@/components/dashboard/quiz-form"
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
          <QuizForm
            onGenerate={handleGenerateQuiz}
            isGenerating={isGenerating}
          />
        </div>
      </ContentSection>
    </div>
  )
}