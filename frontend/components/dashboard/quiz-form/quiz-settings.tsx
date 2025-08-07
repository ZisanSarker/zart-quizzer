"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FadeUp } from "@/components/animations/motion"

interface QuizSettingsProps {
  numberOfQuestions: number
  difficulty: string
  timeLimit: boolean
  isPublic: boolean
  onQuestionsChange: (value: number[]) => void
  onDifficultyChange: (value: string) => void
  onTimeLimitChange: (checked: boolean) => void
  onPublicChange: (checked: boolean) => void
}

export function QuizSettings({
  numberOfQuestions,
  difficulty,
  timeLimit,
  isPublic,
  onQuestionsChange,
  onDifficultyChange,
  onTimeLimitChange,
  onPublicChange
}: QuizSettingsProps) {
  return (
    <>
      <FadeUp delay={0.4} className="space-y-4">
        <div className="flex justify-between">
          <Label className="text-sm sm:text-base">Number of Questions: {numberOfQuestions}</Label>
        </div>
        <Slider
          defaultValue={[numberOfQuestions]}
          max={20}
          min={1}
          step={1}
          onValueChange={onQuestionsChange}
          className="[&>span]:bg-primary"
        />
      </FadeUp>
      
      <FadeUp delay={0.5} className="space-y-2">
        <Label htmlFor="difficulty" className="text-sm sm:text-base">Difficulty Level</Label>
        <Select
          defaultValue={difficulty}
          onValueChange={onDifficultyChange}
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
          checked={timeLimit}
          onCheckedChange={onTimeLimitChange}
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
          checked={isPublic}
          onCheckedChange={onPublicChange}
          className="data-[state=checked]:bg-primary"
        />
      </FadeUp>
    </>
  )
} 