"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Brain, Home, Plus, Library, History, Settings, LogOut, User } from "lucide-react"
import { PageTransition } from "@/components/animations/motion"
import { useAuth } from "@/contexts/auth-context"
import { LayoutWrapper } from "@/components/layout-wrapper"
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

  const getInitials = () => {
    if (!user?.username) return "U"
    return user.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Library },
    { href: "/dashboard", label: "Dashboard", icon: Brain },
  ]

  const sidebarLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/create", label: "Create Quiz", icon: Plus },
    { href: "/dashboard/library", label: "My Library", icon: Library },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-20 dark:bg-background/80 w-full">
          <div className="container flex h-14 sm:h-16 items-center justify-between max-w-7xl mx-auto px-3 sm:px-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Brain className="h-6 w-6 text-primary animate-bounce-small" />
              <span className="font-bold text-xl gradient-heading">ZART Quizzer</span>
            </Link>

            {isAuthenticated && (
              <nav className="flex-1 flex justify-center">
                <ul className="flex gap-2 sm:gap-6 items-center">
                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium transition-all duration-200
                          ${pathname === href
                            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                            : "hover:bg-primary-50/70 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"}
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 transition-colors hover:text-primary">
                    <Avatar className="h-8 w-8 border-2 border-primary-100 transition-transform hover:scale-105">
                      <AvatarImage
                        src={user?.profilePicture || "/placeholder.svg?height=32&width=32"}
                        alt={user?.username || "User"}
                      />
                      <AvatarFallback className="bg-primary-100 text-primary-700">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="cursor-pointer transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex flex-1 w-full min-h-0">
          <Sidebar className="border-t-0">
            <SidebarContent>
              <ul className="flex flex-1 flex-col justify-center items-start gap-1 h-full pl-2">
                {sidebarLinks.map(({ href, label, icon: Icon }) => (
                  <li key={href} className="w-full">
                    <Link
                      href={href}
                      className={`flex items-center gap-2 w-48 px-4 py-2 rounded-md font-medium transition-all duration-200
                        ${pathname === href
                          ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                          : "hover:bg-primary-50/70 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"}
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarContent>
            <SidebarFooter>
              <div className="p-4">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 transition-all duration-300 hover:border-primary-300 hover:text-primary"
                  asChild
                >
                  <Link href="/explore">
                    <Library className="h-5 w-5" />
                    <span>Explore Public Quizzes</span>
                  </Link>
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col w-full items-center justify-center overflow-auto">
            <div className="w-full max-w-7xl px-2 sm:px-4 py-4 md:py-6 mx-auto flex flex-col items-center justify-center">
              <PageTransition>
                <LayoutWrapper>{children}</LayoutWrapper>
              </PageTransition>
            </div>
          </main>
        </div>

        <footer className="w-full py-4 border-t bg-white dark:bg-background text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ZART Quizzer. All rights reserved.
        </footer>
      </div>
    </SidebarProvider>
  )
}