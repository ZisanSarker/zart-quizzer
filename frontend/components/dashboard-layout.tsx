"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Brain, Home, Plus, Library, History, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      const isAuthPage = pathname === '/login' || pathname === '/register' || pathname.startsWith('/auth/')
      if (!isAuthPage) {
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, mounted, router, pathname])

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const sidebarLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/create", label: "Create Quiz", icon: Plus },
    { href: "/dashboard/library", label: "My Library", icon: Library },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <SidebarProvider>
      <div className="flex flex-1 w-full min-h-0">
        {/* Enhanced responsive sidebar */}
        <Sidebar className="border-t-0">
          <SidebarContent>
            <ul className="flex flex-1 flex-col justify-center items-start gap-1 h-full pl-2">
              {sidebarLinks.map(({ href, label, icon: Icon }) => (
                <li key={href} className="w-full">
                  <Link
                    href={href}
                    className={`flex items-center gap-2 w-full px-4 py-3 rounded-md font-medium transition-all duration-200 touch-target
                      ${pathname === href
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                        : "hover:bg-primary-50/70 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"}
                    `}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 transition-all duration-300 hover:border-primary-300 hover:text-primary touch-target"
                asChild
              >
                <Link href="/explore">
                  <Library className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Explore Public Quizzes</span>
                </Link>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Enhanced responsive main content */}
        <main className="flex-1 flex flex-col w-full items-center justify-center overflow-auto">
          <div className="w-full max-w-7xl px-2 sm:px-4 lg:px-6 py-4 md:py-6 mx-auto flex flex-col items-center justify-center">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}