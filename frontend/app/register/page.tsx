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
  const { register, isLoading: authLoading } = useAuth()
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

  const loading = isLoading || authLoading

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-primary-50 to-background dark:from-primary-950/30 dark:to-background">
      <ScaleIn>
        <Card className="w-full max-w-md shadow-soft">
          <CardHeader className="space-y-1">
            <FadeIn className="flex justify-center mb-4">
              <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                <Brain className="h-6 w-6 text-primary animate-bounce-small" />
                <span className="font-bold text-xl gradient-heading">ZART Quizzer</span>
              </Link>
            </FadeIn>
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to get started with ZART Quizzer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FadeUp delay={0.1} className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
                  disabled={loading}
                />
              </FadeUp>
              <FadeUp delay={0.2} className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
                  disabled={loading}
                />
              </FadeUp>
              <FadeUp delay={0.3} className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 ${
                    passwordError && formData.password ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters, include a number and special character
                </p>
              </FadeUp>
              <FadeUp delay={0.4} className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`transition-all duration-300 focus:border-primary-300 focus:ring-primary-200 ${
                    passwordError && formData.confirmPassword ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
              </FadeUp>
              <FadeUp delay={0.5}>
                <GradientButton
                  type="submit"
                  className="w-full"
                  disabled={loading || !!passwordError || !formData.password || !formData.confirmPassword}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account
                    </>
                  ) : (
                    "Sign up"
                  )}
                </GradientButton>
              </FadeUp>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                className="w-full transition-all duration-300"
                onClick={() => (window.location.href = getGoogleAuthUrl())}
                disabled={loading}
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full transition-all duration-300"
                onClick={() => (window.location.href = getGithubAuthUrl())}
                disabled={loading}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <FadeUp delay={0.6} className="text-center text-sm">
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