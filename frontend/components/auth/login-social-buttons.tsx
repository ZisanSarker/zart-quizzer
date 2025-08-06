"use client"

import { Button } from "@/components/ui/button"
import { Github, Mail } from "lucide-react"
import { getGoogleAuthUrl, getGithubAuthUrl } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

interface LoginSocialButtonsProps {
  isLoading: boolean
}

export function LoginSocialButtons({ isLoading }: LoginSocialButtonsProps) {
  const { toast } = useToast()

  return (
    <div className="flex flex-col space-y-2 sm:space-y-3">
      <Button
        variant="outline"
        className="w-full transition-all duration-300 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
        onClick={() => {
          toast({ title: "Redirecting...", description: "Opening Google login." })
          window.location.href = getGoogleAuthUrl()
        }}
        disabled={isLoading}
      >
        <Mail className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button
        variant="outline"
        className="w-full transition-all duration-300 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base"
        onClick={() => {
          toast({ title: "Redirecting...", description: "Opening GitHub login." })
          window.location.href = getGithubAuthUrl()
        }}
        disabled={isLoading}
      >
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  )
} 