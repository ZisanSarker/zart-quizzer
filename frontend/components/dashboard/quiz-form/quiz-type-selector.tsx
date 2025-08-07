"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FadeUp } from "@/components/animations/motion"

interface QuizTypeSelectorProps {
  value: string
  onChange: (value: string) => void
  delay?: number
}

export function QuizTypeSelector({ value, onChange, delay = 0 }: QuizTypeSelectorProps) {
  return (
    <FadeUp delay={delay} className="space-y-2">
      <Label className="text-sm sm:text-base">Quiz Type</Label>
      <RadioGroup
        defaultValue={value}
        onValueChange={onChange}
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
  )
} 