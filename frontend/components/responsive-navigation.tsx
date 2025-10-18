"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  Brain, 
  Home, 
  Library, 
  LogOut, 
  User, 
  Settings, 
  Menu, 
  X,
  Plus,
  History
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function ResponsiveNavigation() {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Library },
    { href: "/dashboard", label: "Dashboard", icon: Brain },
  ]

  const dashboardLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/create", label: "Create Quiz", icon: Plus },
    { href: "/dashboard/library", label: "My Library", icon: Library },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
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
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:w-96">
            <SheetHeader>
              <SheetTitle className="text-left">
                <div className="flex items-center gap-2">
                  <img 
                    src="/logo.png" 
                    alt="ZART Quizzer" 
                    className="h-8 w-8"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="font-bold text-lg text-primary">ZART Quizzer</span>
                </div>
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* User Profile Section */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="h-12 w-12 border-2 border-primary-100">
                    <AvatarImage
                      src={user?.profilePicture || "/placeholder.svg?height=48&width=48"}
                      alt={user?.username || "User"}
                    />
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{user?.username}</div>
                    <div className="text-sm text-muted-foreground">{user?.email}</div>
                  </div>
                </div>
              )}

              {/* Main Navigation */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  Navigation
                </h3>
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 touch-target
                      ${pathname === href
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                        : "hover:bg-primary-50/70 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"}
                    `}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

              {/* Dashboard Navigation (if authenticated) */}
              {isAuthenticated && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    Dashboard
                  </h3>
                  {dashboardLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 touch-target
                        ${pathname === href
                          ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                          : "hover:bg-primary-50/70 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"}
                      `}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    Account
                  </h3>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 touch-target hover:bg-primary-50/70 hover:text-primary-700"
                  >
                    <User className="h-5 w-5 flex-shrink-0" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 touch-target hover:bg-primary-50/70 hover:text-primary-700"
                  >
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={async () => {
                      try { await logout() } catch {}
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 touch-target w-full text-left hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span>Log out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-4">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 px-4 rounded-lg border border-border hover:bg-muted transition-colors touch-target"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors touch-target"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
} 