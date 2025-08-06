"use client"

import { useState } from "react"
import Link from "next/link"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Brain, Github, Loader2, Mail } from "lucide-react"
import { FadeUp } from "@/components/animations/motion"
import { getGoogleAuthUrl, getGithubAuthUrl } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

interface LoginFormProps {
  onSubmit: (formData: { email: string; password: string }) => Promise<void>
  isLoading: boolean
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive",
      })
      return
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <FadeUp delay={0.1} className="space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          value={formData.email}
          onChange={handleChange}
          className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
          disabled={isLoading}
        />
      </FadeUp>
      <FadeUp delay={0.2} className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
          <Link href="/forgot-password" className="text-xs sm:text-sm text-primary hover:underline transition-colors">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="********"
          required
          value={formData.password}
          onChange={handleChange}
          className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
          disabled={isLoading}
        />
      </FadeUp>
      <FadeUp delay={0.3}>
        <GradientButton type="submit" className="w-full min-h-[44px] sm:min-h-[40px] text-sm sm:text-base" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            "Log in"
          )}
        </GradientButton>
      </FadeUp>
    </form>
  )
} 