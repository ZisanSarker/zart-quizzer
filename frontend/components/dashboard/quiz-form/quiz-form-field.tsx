"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FadeUp } from "@/components/animations/motion"

interface QuizFormFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  type?: "input" | "textarea"
  delay?: number
  required?: boolean
}

export function QuizFormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "input",
  delay = 0,
  required = false
}: QuizFormFieldProps) {
  return (
    <FadeUp delay={delay} className="space-y-2">
      <Label htmlFor={name} className="text-sm sm:text-base">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {type === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
        />
      ) : (
        <Input
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
        />
      )}
    </FadeUp>
  )
} 