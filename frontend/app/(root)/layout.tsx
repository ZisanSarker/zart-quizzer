"use client"

import type React from "react"
import HomeLayout from "@/components/home-layout"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <HomeLayout>{children}</HomeLayout>
}