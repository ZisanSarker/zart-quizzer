"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Github, Loader2, Mail } from "lucide-react"
import { FadeIn, FadeUp, ScaleIn } from "@/components/animations/motion"
import { useAuth } from "@/contexts/auth-context"
import { getGoogleAuthUrl, getGithubAuthUrl } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const { register, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
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
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    if (passwordError) return

    setIsLoading(true)
    const { username, email, password } = formData
    try {
      await register({ username, email, password })
      toast({
        title: "Account created!",
        description: "Welcome to ZART Quizzer. You can now log in.",
      })
      router.push("/dashboard")
    } catch (err: any) {
      let message = "Registration failed. Please try again."
      if (err?.response?.data?.message) {
        message = err.response.data.message
      } else if (err?.message) {
        message = err.message
      }
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 md:p-6 bg-gradient-to-b from-primary-50 to-background dark:from-primary-950/30 dark:to-background">
      <ScaleIn>
        <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-soft">
          <CardHeader className="space-y-2 sm:space-y-3 p-4 sm:p-6">
            <FadeIn className="flex justify-center mb-4 sm:mb-6">
              <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-primary animate-bounce-small" />
                <span className="font-bold text-lg sm:text-xl lg:text-2xl gradient-heading">ZART Quizzer</span>
              </Link>
            </FadeIn>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Enter your information to get started with ZART Quizzer
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
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

            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2 sm:space-y-3">
              <Button
                variant="outline"
                className="w-full transition-all duration-300 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
                onClick={() => (window.location.href = getGoogleAuthUrl())}
                disabled={isLoading}
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full transition-all duration-300 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
                onClick={() => (window.location.href = getGithubAuthUrl())}
                disabled={isLoading}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 p-4 sm:p-6">
            <FadeUp delay={0.6} className="text-center text-xs sm:text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline transition-colors">
                Log in
              </Link>
            </FadeUp>
          </CardFooter>
        </Card>
      </ScaleIn>
    </div>
  )
}