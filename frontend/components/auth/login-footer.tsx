"use client"

import Link from "next/link"
import { FadeUp } from "@/components/animations/motion"

export function LoginFooter() {
  return (
    <FadeUp delay={0.4} className="text-center text-xs sm:text-sm">
      Don&apos;t have an account?{" "}
      <Link href="/register" className="text-primary hover:underline transition-colors">
        Sign up
      </Link>
    </FadeUp>
  )
} 