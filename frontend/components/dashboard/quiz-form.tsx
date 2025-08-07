"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FadeIn } from "@/components/animations/motion"
import { 
  QuizFormField, 
  QuizTypeSelector, 
  QuizSettings, 
  QuizFormSubmit 
} from "./quiz-form/index"

interface QuizFormData {
  topic: string
  description: string
  quizType: "multiple-choice" | "true-false" | "mixed"
  numberOfQuestions: number
  difficulty: "easy" | "medium" | "hard"
  timeLimit: boolean
  isPublic: boolean
}

interface QuizFormProps {
  onGenerate: (data: QuizFormData) => Promise<void>
  isGenerating: boolean
}

export function QuizForm({ onGenerate, isGenerating }: QuizFormProps) {
  const [formData, setFormData] = useState<QuizFormData>({
    topic: "",
    description: "",
    quizType: "multiple-choice",
    numberOfQuestions: 5,
    difficulty: "medium",
    timeLimit: true,
    isPublic: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSliderChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, numberOfQuestions: value[0] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onGenerate(formData)
  }

  return (
    <Tabs defaultValue="form" className="w-full max-w-4xl animate-fade-in">
      <TabsList className="grid w-full max-w-full sm:max-w-md grid-cols-1 mb-4 sm:mb-6 bg-muted/80">
        <TabsTrigger
          value="form"
          className="transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm sm:text-base"
        >
          Manual Input
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="form">
        <FadeIn>
          <Card className="shadow-soft">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="gradient-heading text-lg sm:text-xl lg:text-2xl">Quiz Details</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Enter the details for your quiz. Be specific about the topic to get better results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <QuizFormField
                label="Topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="e.g., Mathematics, World History, Programming"
                delay={0.1}
                required
              />
              
              <QuizFormField
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide additional details about the quiz content"
                type="textarea"
                delay={0.2}
              />
              
              <QuizTypeSelector
                value={formData.quizType}
                onChange={(value) => handleSelectChange("quizType", value)}
                delay={0.3}
              />
              
              <QuizSettings
                numberOfQuestions={formData.numberOfQuestions}
                difficulty={formData.difficulty}
                timeLimit={formData.timeLimit}
                isPublic={formData.isPublic}
                onQuestionsChange={handleSliderChange}
                onDifficultyChange={(value) => handleSelectChange("difficulty", value)}
                onTimeLimitChange={(checked) => handleSwitchChange("timeLimit", checked)}
                onPublicChange={(checked) => handleSwitchChange("isPublic", checked)}
              />
            </CardContent>
            <CardFooter className="p-4 sm:p-6">
              <QuizFormSubmit
                onSubmit={handleSubmit}
                isGenerating={isGenerating}
                isDisabled={!formData.topic}
              />
            </CardFooter>
          </Card>
        </FadeIn>
      </TabsContent>
    </Tabs>
  )
} 