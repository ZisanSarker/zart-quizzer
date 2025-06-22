"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
import { Brain, Home, Library, LogOut, User, Settings } from "lucide-react"
import { PageTransition } from "@/components/animations/motion"
import { useAuth } from "@/contexts/auth-context"
import { LayoutWrapper } from "@/components/layout-wrapper"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()

  // Navbar links for authenticated users
  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Library },
    { href: "/dashboard", label: "Dashboard", icon: Brain },
  ]

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.username) return "U"
    return user.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 dark:bg-background/80 w-full">
        <div className="container flex h-14 sm:h-16 items-center justify-between max-w-7xl mx-auto px-3 sm:px-4">
          {/* Left: Logo & Name */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Brain className="h-6 w-6 text-primary animate-bounce-small" />
            <span className="font-bold text-xl gradient-heading">ZART Quizzer</span>
          </Link>

          {/* Center: Navbar for authenticated users */}
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

          {/* Right: Profile section or login/signup */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
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
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hover:text-primary transition-colors">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" variant="default">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex flex-col w-full items-center justify-center overflow-auto">
        <div className="w-full max-w-7xl px-2 sm:px-4 py-4 md:py-6 mx-auto flex flex-col items-center justify-center">
          <PageTransition>
            <LayoutWrapper>{children}</LayoutWrapper>
          </PageTransition>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t bg-white dark:bg-background text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} ZART Quizzer. All rights reserved.
      </footer>
    </div>
  )
}