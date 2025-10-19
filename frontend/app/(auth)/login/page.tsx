"use client"

import { useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { LoginHeader } from "@/components/auth/login-header"
import { LazyLoginForm } from "@/components/lazy-components"
import { LoginSocialButtons } from "@/components/auth/login-social-buttons"
import { LoginFooter } from "@/components/auth/login-footer"

const ScaleIn = dynamic(() => import('@/components/animations/motion').then(mod => mod.ScaleIn), {
  ssr: false,
})

export default function LoginPage() {
  const { login, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Only redirect if user is already logged in
    if (user) {
      router.replace("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (formData: { email: string; password: string }) => {
    try {
      await login(formData)
      toast({
        title: "Logged in successfully",
        description: "Welcome back! Redirecting...",
      })
      router.push("/dashboard")
    } catch (err: any) {
      let message = "Failed to log in. Please try again."
      if (err?.response?.data?.message) {
        message = err.response.data.message
      } else if (err?.message) {
        message = err.message
      }
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 md:p-6 bg-gradient-to-b from-primary-50 to-background dark:from-primary-950/30 dark:to-background">
      <ScaleIn>
        <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-soft">
          <CardHeader className="space-y-2 sm:space-y-3 p-4 sm:p-6">
            <LoginHeader />
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">Log in to your account</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Enter your email and password to access your quizzes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Suspense fallback={<div className="space-y-4">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>}>
              <LazyLoginForm onSubmit={handleSubmit} isLoading={false} />
            </Suspense>

            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <LoginSocialButtons isLoading={false} />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 p-4 sm:p-6">
            <LoginFooter />
          </CardFooter>
        </Card>
      </ScaleIn>
    </div>
  )
}