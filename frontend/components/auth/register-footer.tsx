"use client"

import Link from "next/link"
import { FadeUp } from "@/components/animations/motion"

export function RegisterFooter() {
  return (
    <FadeUp delay={0.6} className="text-center text-xs sm:text-sm">
      Already have an account?{" "}
      <Link href="/login" className="text-primary hover:underline transition-colors">
        Log in
      </Link>
    </FadeUp>
  )
} 