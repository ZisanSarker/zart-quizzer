"use client"

import type React from "react"
import { PageTransition } from "@/components/animations/motion"
import { LayoutWrapper } from "@/components/layout-wrapper"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      <LayoutWrapper>{children}</LayoutWrapper>
    </PageTransition>
  )
}