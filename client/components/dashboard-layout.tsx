"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Brain, Home, Plus, Library, History, Settings, LogOut, User, Bell } from "lucide-react"
import { PageTransition } from "@/components/animations/motion"
import { useAuth } from "@/contexts/auth-context"
import { LayoutWrapper } from "@/components/layout-wrapper"

// Mock notifications data
const notificationsMock = [
  {
    id: "n1",
    title: "New quiz available",
    message: "World History quiz is now available for practice",
    time: "2023-06-15T14:30:00Z",
    read: false,
  },
  {
    id: "n2",
    title: "Quiz completed",
    message: "Your quiz 'Math Basics' was completed by 5 users",
    time: "2023-06-14T09:15:00Z",
    read: false,
  },
  {
    id: "n3",
    title: "Quiz results",
    message: "Results are ready for 'Science 101'",
    time: "2023-06-10T16:45:00Z",
    read: true,
  },
  {
    id: "n4",
    title: "New follower",
    message: "Jane Smith is now following you",
    time: "2023-06-05T11:20:00Z",
    read: true,
  },
  {
    id: "n5",
    title: "Quiz featured",
    message: "Your quiz 'History Trivia' was featured on the homepage",
    time: "2023-06-01T13:40:00Z",
    read: true,
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState(notificationsMock)
  const [mounted, setMounted] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    // Redirect if not authenticated
    if (!isAuthenticated && mounted) {
      router.push("/login")
    }
  }, [isAuthenticated, mounted, router])

  // Get unread notifications count
  const unreadNotificationsCount = notifications.filter((notification) => !notification.read).length

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prevNotifications) => prevNotifications.map((notification) => ({ ...notification, read: true })))
  }

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  if (!mounted || !isAuthenticated) {
    return null
  }

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <Brain className="h-6 w-6 text-primary animate-bounce-small" />
              <span className="font-bold text-xl gradient-heading">ZART Quizzer</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  className="transition-all duration-300 hover:text-primary data-[active=true]:bg-primary-100 data-[active=true]:text-primary-700 dark:data-[active=true]:bg-primary-900/30 dark:data-[active=true]:text-primary-300"
                >
                  <Link href="/dashboard">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/create"}
                  className="transition-all duration-300 hover:text-primary data-[active=true]:bg-primary-100 data-[active=true]:text-primary-700 dark:data-[active=true]:bg-primary-900/30 dark:data-[active=true]:text-primary-300"
                >
                  <Link href="/dashboard/create">
                    <Plus className="h-5 w-5" />
                    <span>Create Quiz</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/library"}
                  className="transition-all duration-300 hover:text-primary data-[active=true]:bg-primary-100 data-[active=true]:text-primary-700 dark:data-[active=true]:bg-primary-900/30 dark:data-[active=true]:text-primary-300"
                >
                  <Link href="/dashboard/library">
                    <Library className="h-5 w-5" />
                    <span>My Library</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/history"}
                  className="transition-all duration-300 hover:text-primary data-[active=true]:bg-primary-100 data-[active=true]:text-primary-700 dark:data-[active=true]:bg-primary-900/30 dark:data-[active=true]:text-primary-300"
                >
                  <Link href="/dashboard/history">
                    <History className="h-5 w-5" />
                    <span>History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/settings"}
                  className="transition-all duration-300 hover:text-primary data-[active=true]:bg-primary-100 data-[active=true]:text-primary-700 dark:data-[active=true]:bg-primary-900/30 dark:data-[active=true]:text-primary-300"
                >
                  <Link href="/dashboard/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
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

        <div className="flex flex-col flex-1 w-full">
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 dark:bg-background/80 w-full">
            <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
              <div className="flex items-center gap-2 lg:hidden">
                <SidebarTrigger className="hover:text-primary transition-colors" />
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative transition-all duration-300 hover:border-primary-300 hover:text-primary"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground animate-pulse-slow">
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80">
                    <div className="flex items-center justify-between px-4 py-2">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      {unreadNotificationsCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
                          Mark all as read
                        </Button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="max-h-[300px] overflow-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className={`p-3 cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300 ${!notification.read ? "bg-primary-50/50" : ""}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex flex-col gap-1 w-full">
                              <div className="flex justify-between items-start">
                                <span className="font-medium">{notification.title}</span>
                                {!notification.read && (
                                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0"></span>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">{notification.message}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(notification.time)}
                              </span>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">No notifications</div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="justify-center">
                          <Link href="/dashboard/notifications" className="text-primary hover:text-primary">
                            View all notifications
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

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
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
                    >
                      <Link href="/dashboard/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer transition-colors hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
                    >
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
          <main className="flex-1 flex items-center justify-center w-full overflow-auto">
            <div className="w-full max-w-7xl px-2 sm:px-4 py-4 md:py-6 mx-auto flex flex-col items-center justify-center">
              <PageTransition>
                <LayoutWrapper>{children}</LayoutWrapper>
              </PageTransition>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
