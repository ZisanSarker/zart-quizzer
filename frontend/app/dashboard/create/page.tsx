"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { Loader2, Mic, Sparkles } from "lucide-react"
import { FadeIn, FadeUp, ScaleIn } from "@/components/animations/motion"
import { generateQuiz } from "@/lib/quiz"
import { useAuth } from "@/contexts/auth-context"

export default function CreateQuizPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceInput, setVoiceInput] = useState("")

  const [formData, setFormData] = useState({
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

  const handleVoiceCommand = () => {
    setIsListening(true)
    setTimeout(() => {
      setIsListening(false)
      setVoiceInput("Generate a quiz on Mathematics with 10 multiple choice questions for general practice.")
      setFormData({
        topic: "Mathematics",
        description: "General practice quiz on Mathematics",
        quizType: "multiple-choice",
        numberOfQuestions: 5,
        difficulty: "medium",
        timeLimit: true,
        isPublic: false,
      })
      toast({
        title: "Voice command recognized",
        description: "Form has been filled based on your voice input.",
      })
    }, 2000)
  }

  const handleGenerateQuiz = async () => {
    setIsGenerating(true)
    try {
      const { topic, description, quizType, numberOfQuestions, difficulty, timeLimit, isPublic } = formData
      // Always pass timeLimit!
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
      toast({
        title: "Quiz generation failed",
        description: error.response?.data?.message || "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">Create Quiz</h1>
      </div>
      <div className="w-full flex flex-col items-center">
        <Tabs defaultValue="form" className="w-auto max-w-4xl animate-fade-in">
          <TabsList className="grid w-full max-w-full sm:max-w-md grid-cols-2 mb-6 bg-muted/80">
            <TabsTrigger
              value="form"
              className="transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Manual Input
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Voice Command
            </TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <FadeIn>
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="gradient-heading">Quiz Details</CardTitle>
                  <CardDescription>
                    Enter the details for your quiz. Be specific about the topic to get better results.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <FadeUp delay={0.1} className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      name="topic"
                      placeholder="e.g., Mathematics, World History, Programming"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
                    />
                  </FadeUp>
                  <FadeUp delay={0.2} className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Provide additional details about the quiz content"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
                    />
                  </FadeUp>
                  <FadeUp delay={0.3} className="space-y-2">
                    <Label>Quiz Type</Label>
                    <RadioGroup
                      defaultValue={formData.quizType}
                      onValueChange={(value) => handleSelectChange("quizType", value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="multiple-choice"
                          id="multiple-choice"
                          className="text-primary border-primary-300"
                        />
                        <Label htmlFor="multiple-choice" className="cursor-pointer">
                          Multiple Choice
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true-false" id="true-false" className="text-primary border-primary-300" />
                        <Label htmlFor="true-false" className="cursor-pointer">
                          True/False
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mixed" id="mixed" className="text-primary border-primary-300" />
                        <Label htmlFor="mixed" className="cursor-pointer">
                          Mixed
                        </Label>
                      </div>
                    </RadioGroup>
                  </FadeUp>
                  <FadeUp delay={0.4} className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Number of Questions: {formData.numberOfQuestions}</Label>
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
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      defaultValue={formData.difficulty}
                      onValueChange={(value) => handleSelectChange("difficulty", value)}
                    >
                      <SelectTrigger className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Beginner</SelectItem>
                        <SelectItem value="medium">Intermediate</SelectItem>
                        <SelectItem value="hard">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </FadeUp>
                  <FadeUp delay={0.6} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="timeLimit">Time Limit</Label>
                      <p className="text-sm text-muted-foreground">Set a time limit for each question</p>
                    </div>
                    <Switch
                      id="timeLimit"
                      checked={formData.timeLimit}
                      onCheckedChange={(checked) => handleSwitchChange("timeLimit", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FadeUp>
                  <FadeUp delay={0.7} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isPublic">Make Public</Label>
                      <p className="text-sm text-muted-foreground">Allow other users to find and take your quiz</p>
                    </div>
                    <Switch
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => handleSwitchChange("isPublic", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FadeUp>
                </CardContent>
                <CardFooter>
                  <GradientButton
                    className="w-full gap-2"
                    onClick={handleGenerateQuiz}
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
          <TabsContent value="voice">
            <ScaleIn>
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="gradient-heading">Voice Command</CardTitle>
                  <CardDescription>
                    Use your voice to create a quiz. Speak clearly and include the topic, number of questions, and quiz type.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10 space-y-6">
                  <div className="relative">
                    <Button
                      size="lg"
                      className={`rounded-full p-8 transition-all duration-300 ${isListening ? "bg-primary/20 animate-pulse" : "hover:bg-primary/10"}`}
                      onClick={handleVoiceCommand}
                      disabled={isListening}
                    >
                      <Mic className={`h-8 w-8 ${isListening ? "text-primary" : ""}`} />
                    </Button>
                    {isListening && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-20"></div>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    {isListening ? (
                      <p className="text-lg font-medium">Listening...</p>
                    ) : (
                      <p className="text-lg font-medium">Tap the microphone and speak</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      Example: "Generate a quiz on Mathematics with 10 multiple choice questions for general practice."
                    </p>
                  </div>
                  {voiceInput && (
                    <FadeIn className="w-full mt-6">
                      <Label>Recognized Command</Label>
                      <div className="p-4 bg-muted rounded-lg mt-2 border border-primary-100">
                        <p>{voiceInput}</p>
                      </div>
                      <GradientButton className="w-full mt-6 gap-2" onClick={handleGenerateQuiz} disabled={isGenerating}>
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
                    </FadeIn>
                  )}
                </CardContent>
              </Card>
            </ScaleIn>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
