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
import { useAuth } from "@/contexts/auth-context"

export default function SharedHeader() {
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
    <header className="sticky top-0 z-10 w-full py-2">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-3xl mx-4 sm:mx-8 lg:mx-12 border border-white/30 dark:border-white/10 shadow-lg">
          <div className="flex h-12 sm:h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left: Logo or Text */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="/logo.png" 
                alt="ZART Quizzer" 
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden font-bold text-lg sm:text-xl text-primary font-playfair-display-sc">ZART Quizzer</span>
            </Link>

            {/* Center: Desktop Navigation for authenticated users */}
            {isAuthenticated && (
              <nav className="hidden md:flex flex-1 justify-center">
                <ul className="flex gap-2 lg:gap-6 items-center">
                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium transition-all duration-200 touch-target
                          ${pathname === href
                            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                            : "hover:bg-primary-50/70 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"}
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="hidden lg:inline-block">{label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Right: Profile section or login/signup */}
            <div className="flex items-center gap-2 sm:gap-4">
              {isAuthenticated ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 transition-colors hover:text-primary touch-target">
                        <Avatar className="h-8 w-8 border-2 border-primary-100 transition-transform hover:scale-105">
                          <AvatarImage
                            src={user?.profilePicture || "/placeholder.svg?height=32&width=32"}
                            alt={user?.username || "User"}
                          />
                          <AvatarFallback className="bg-primary-100 text-primary-700">{getInitials()}</AvatarFallback>
                        </Avatar>
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
                        onClick={() => logout()}
                        className="cursor-pointer transition-colors hover:bg-destructive/10 hover:text-destructive touch-target"
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
        </div>
      </div>
    </header>
  )
} 