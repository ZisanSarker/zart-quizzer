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
import ResponsiveNavigation from "@/components/responsive-navigation"

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
          <div className="grid grid-cols-3 h-12 sm:h-14 items-center px-4 sm:px-6 lg:px-8">
            {/* Left: Logo or Text */}
            <div className="flex justify-start">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <span className="font-bold text-base sm:text-lg md:text-xl text-primary font-playfair-display-sc">ZART Quizzer</span>
              </Link>
            </div>

            {/* Center & Right: Responsive Navigation handles both columns */}
            <ResponsiveNavigation />
          </div>
        </div>
      </div>
    </header>
  )
} 