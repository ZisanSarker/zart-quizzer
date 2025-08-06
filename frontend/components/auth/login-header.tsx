"use client"

import Link from "next/link"
import { Brain } from "lucide-react"
import { FadeIn } from "@/components/animations/motion"

export function LoginHeader() {
  return (
    <FadeIn className="flex justify-center mb-4 sm:mb-6">
      <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
        <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-primary animate-bounce-small" />
        <span className="font-bold text-lg sm:text-xl lg:text-2xl gradient-heading">ZART Quizzer</span>
      </Link>
    </FadeIn>
  )
} 