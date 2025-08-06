"use client"

import { useState } from "react"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { FadeUp } from "@/components/animations/motion"

interface RegisterFormProps {
  onSubmit: (formData: { username: string; email: string; password: string; confirmPassword: string }) => Promise<void>
  isLoading: boolean
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Password validation
    if (name === "password") {
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters")
      } else if (!/\d/.test(value)) {
        setPasswordError("Password must include a number")
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        setPasswordError("Password must include a special character")
      } else if (formData.confirmPassword && value !== formData.confirmPassword) {
        setPasswordError("Passwords do not match")
      } else {
        setPasswordError("")
      }
    }

    // Confirm password validation
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setPasswordError("Passwords do not match")
      } else if (
        formData.password.length >= 8 &&
        /\d/.test(formData.password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
      ) {
        setPasswordError("")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    if (passwordError) return

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <FadeUp delay={0.1} className="space-y-2">
        <Label htmlFor="username" className="text-sm sm:text-base">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="johndoe"
          required
          value={formData.username}
          onChange={handleChange}
          className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
          disabled={isLoading}
        />
      </FadeUp>
      <FadeUp delay={0.2} className="space-y-2">
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
      <FadeUp delay={0.3} className="space-y-2">
        <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className={`transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base ${
            passwordError && formData.password ? "border-red-500" : ""
          }`}
          disabled={isLoading}
        />
        <p className="text-xs sm:text-sm text-muted-foreground">
          Password must be at least 8 characters, include a number and special character
        </p>
      </FadeUp>
      <FadeUp delay={0.4} className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base ${
            passwordError && formData.confirmPassword ? "border-red-500" : ""
          }`}
          disabled={isLoading}
        />
        {passwordError && <p className="text-xs sm:text-sm text-red-500">{passwordError}</p>}
      </FadeUp>
      <FadeUp delay={0.5}>
        <GradientButton
          type="submit"
          className="w-full min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
          disabled={isLoading || !!passwordError || !formData.password || !formData.confirmPassword}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account
            </>
          ) : (
            "Sign up"
          )}
        </GradientButton>
      </FadeUp>
    </form>
  )
} 