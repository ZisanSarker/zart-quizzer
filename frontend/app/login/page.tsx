"use client"

import React,{ useEffect, useState } from "react"
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

export default function LoginPage() {
  const { login, isLoading, user } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard")
    }
  }, [isLoading, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await login(formData)
  }

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
            <CardTitle className="text-2xl font-bold text-center">Log in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your quizzes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FadeUp delay={0.1} className="space-y-2">
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
                />
              </FadeUp>
              <FadeUp delay={0.2} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
                />
              </FadeUp>
              <FadeUp delay={0.3}>
                <GradientButton type="submit" className="w-full" disabled={isLoading}>
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
                className="w-full transition-all duration-300 hover:bg-primary-50"
                onClick={() => (window.location.href = getGoogleAuthUrl())}
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full transition-all duration-300 hover:bg-primary-50"
                onClick={() => (window.location.href = getGithubAuthUrl())}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <FadeUp delay={0.4} className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline transition-colors">
                Sign up
              </Link>
            </FadeUp>
          </CardFooter>
        </Card>
      </ScaleIn>
    </div>
  )
}
