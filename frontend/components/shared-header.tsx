"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { OptimizedAvatar } from "@/components/ui/optimized-avatar"
import { LogOut, User, Settings, Home, Library, Brain } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

// Lazy load dropdown menu for better performance
const DropdownMenu = dynamic(
  () => import('@/components/ui/dropdown-menu').then(mod => mod.DropdownMenu),
  { ssr: false }
)

const DropdownMenuContent = dynamic(
  () => import('@/components/ui/dropdown-menu').then(mod => mod.DropdownMenuContent),
  { ssr: false }
)

const DropdownMenuItem = dynamic(
  () => import('@/components/ui/dropdown-menu').then(mod => mod.DropdownMenuItem),
  { ssr: false }
)

const DropdownMenuLabel = dynamic(
  () => import('@/components/ui/dropdown-menu').then(mod => mod.DropdownMenuLabel),
  { ssr: false }
)

const DropdownMenuSeparator = dynamic(
  () => import('@/components/ui/dropdown-menu').then(mod => mod.DropdownMenuSeparator),
  { ssr: false }
)

const DropdownMenuTrigger = dynamic(
  () => import('@/components/ui/dropdown-menu').then(mod => mod.DropdownMenuTrigger),
  { ssr: false }
)

const ResponsiveNavigation = dynamic(
  () => import('@/components/responsive-navigation'),
  {
    loading: () => <div className="h-10 w-10" />,
    ssr: false,
  }
)

export default function SharedHeader() {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()

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
    <header className="sticky top-0 z-10 w-full py-2">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-3xl mx-4 sm:mx-8 lg:mx-12 border border-white/30 dark:border-white/10 shadow-lg">
          <div className="flex h-12 sm:h-14 items-center px-4 sm:px-6 lg:px-8">
            {/* Left: Logo or Text */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
              <Image
                src="/placeholder-logo.png"
                alt="ZART Quizzer"
                width={56}
                height={56}
                priority
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
                sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, (max-width: 1024px) 48px, 56px"
              />
              <span className="hidden sm:inline-block font-bold text-base sm:text-lg md:text-xl text-primary font-playfair-display-sc">ZART Quizzer</span>
            </Link>

            {/* Center: Responsive Navigation */}
            <div className="flex-1 flex justify-center">
              {/* Desktop Navigation Links */}
              <div className="hidden lg:block">
                {isAuthenticated && (
                  <nav className="flex gap-2 lg:gap-6 items-center">
                    {[
                      { href: "/", label: "Home", icon: Home },
                      { href: "/explore", label: "Explore", icon: Library },
                      { href: "/dashboard", label: "Dashboard", icon: Brain },
                    ].map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium transition-all duration-200 touch-target
                          ${pathname === href
                            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                            : "hover:bg-primary-50/70 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"}
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="hidden xl:inline-block">{label}</span>
                      </Link>
                    ))}
                  </nav>
                )}
              </div>
            </div>

            {/* Right: User Profile/Auth */}
            <div className="flex-shrink-0">
              <div className="hidden lg:block">
                <div className="flex items-center gap-2">
                  {isAuthenticated ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 transition-colors hover:text-primary touch-target">
                          <OptimizedAvatar
                            src={user?.profilePicture || "/placeholder.svg?height=32&width=32"}
                            alt={user?.username || "User"}
                            size="sm"
                            fallbackText={getInitials()}
                            className="h-8 w-8 border-2 border-primary-100 transition-transform hover:scale-105"
                          />
                          <span className="hidden sm:inline-block">{user?.username}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/profile" className="touch-target">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/settings" className="touch-target">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={async () => {
                            try { await logout() } catch {}
                          }}
                          className="cursor-pointer transition-colors hover:bg-destructive/10 hover:text-destructive touch-target"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex gap-2">
                      <Link href="/login">
                        <Button variant="ghost" size="sm" className="hover:text-primary transition-colors touch-target">
                          Log in
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button size="sm" variant="default" className="touch-target">
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <ResponsiveNavigation />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 