"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Cookies from "js-cookie"
import { Loader2, Brain } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function OAuthSuccessPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const accessToken = params.get("accessToken")
    const refreshToken = params.get("refreshToken")
    if (accessToken && refreshToken) {
      Cookies.set("accessToken", accessToken, { secure: true, sameSite: "strict" })
      Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "strict" })
      // Show welcome toast with emoji
      toast({
        title: "Welcome back! 🎉",
        description: "You've been logged in successfully.",
      })
      // Redirect after a short delay
      setTimeout(() => {
        router.replace("/dashboard")
      }, 1200)
    } else {
      router.replace("/login")
    }
  }, [params, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-primary-950/30 dark:to-background">
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl shadow-xl bg-white/90 dark:bg-slate-900/80">
        <span className="animate-bounce text-5xl mb-2"><Brain className="w-12 h-12"/></span>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight flex gap-2 items-center">
          Logging you in...
          <Brain className="w-6 h-6 text-yellow-400 animate-pulse" />
        </h1>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-muted-foreground text-base">
            Please wait while we prepare your dashboard
          </span>
        </div>
      </div>
    </div>
  )
}