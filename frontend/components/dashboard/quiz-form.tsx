"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles } from "lucide-react"
import { FadeIn, FadeUp, ScaleIn } from "@/components/animations/motion"

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
              <FadeUp delay={0.1} className="space-y-2">
                <Label htmlFor="topic" className="text-sm sm:text-base">Topic</Label>
                <Input
                  id="topic"
                  name="topic"
                  placeholder="e.g., Mathematics, World History, Programming"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
                />
              </FadeUp>
              <FadeUp delay={0.2} className="space-y-2">
                <Label htmlFor="description" className="text-sm sm:text-base">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide additional details about the quiz content"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
                />
              </FadeUp>
              <FadeUp delay={0.3} className="space-y-2">
                <Label className="text-sm sm:text-base">Quiz Type</Label>
                <RadioGroup
                  defaultValue={formData.quizType}
                  onValueChange={(value) => handleSelectChange("quizType", value)}
                  className="flex flex-col space-y-2 sm:space-y-3"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <RadioGroupItem
                      value="multiple-choice"
                      id="multiple-choice"
                      className="text-primary border-primary-300"
                    />
                    <Label htmlFor="multiple-choice" className="cursor-pointer text-sm sm:text-base">
                      Multiple Choice
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <RadioGroupItem value="true-false" id="true-false" className="text-primary border-primary-300" />
                    <Label htmlFor="true-false" className="cursor-pointer text-sm sm:text-base">
                      True/False
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <RadioGroupItem value="mixed" id="mixed" className="text-primary border-primary-300" />
                    <Label htmlFor="mixed" className="cursor-pointer text-sm sm:text-base">
                      Mixed
                    </Label>
                  </div>
                </RadioGroup>
              </FadeUp>
              <FadeUp delay={0.4} className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-sm sm:text-base">Number of Questions: {formData.numberOfQuestions}</Label>
                </div>
                <Slider
                  defaultValue={[formData.numberOfQuestions]}
                  max={20}
                  min={1}
                  step={1}
                  onValueChange={handleSliderChange}
                  className="[&>span]:bg-primary"
                />
              </FadeUp>
              <FadeUp delay={0.5} className="space-y-2">
                <Label htmlFor="difficulty" className="text-sm sm:text-base">Difficulty Level</Label>
                <Select
                  defaultValue={formData.difficulty}
                  onValueChange={(value) => handleSelectChange("difficulty", value)}
                >
                  <SelectTrigger className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Beginner</SelectItem>
                    <SelectItem value="medium">Intermediate</SelectItem>
                    <SelectItem value="hard">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </FadeUp>
              <FadeUp delay={0.6} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="space-y-0.5">
                  <Label htmlFor="timeLimit" className="text-sm sm:text-base">Time Limit</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Set a time limit for each question</p>
                </div>
                <Switch
                  id="timeLimit"
                  checked={formData.timeLimit}
                  onCheckedChange={(checked) => handleSwitchChange("timeLimit", checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </FadeUp>
              <FadeUp delay={0.7} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic" className="text-sm sm:text-base">Make Public</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Allow other users to find and take your quiz</p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleSwitchChange("isPublic", checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </FadeUp>
            </CardContent>
            <CardFooter className="p-4 sm:p-6">
              <GradientButton
                className="w-full gap-2 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
                onClick={handleSubmit}
                disabled={!formData.topic || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Quiz
                  </>
                )}
              </GradientButton>
            </CardFooter>
          </Card>
        </FadeIn>
      </TabsContent>
    </Tabs>
  )
} 