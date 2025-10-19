"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { LoginHeader } from "@/components/auth/login-header"
import { LazyRegisterForm } from "@/components/lazy-components"
import { RegisterSocialButtons } from "@/components/auth/register-social-buttons"
import { RegisterFooter } from "@/components/auth/register-footer"

const ScaleIn = dynamic(() => import('@/components/animations/motion').then(mod => mod.ScaleIn), {
  ssr: false,
})

export default function RegisterPage() {
  const { register, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: { username: string; email: string; password: string; confirmPassword: string }) => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      return
    }

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
            <LoginHeader />
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Enter your information to get started with ZART Quizzer
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Suspense fallback={<div className="space-y-4">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>}>
              <LazyRegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
            </Suspense>

            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <RegisterSocialButtons isLoading={isLoading} />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 p-4 sm:p-6">
            <RegisterFooter />
          </CardFooter>
        </Card>
      </ScaleIn>
    </div>
  )
}