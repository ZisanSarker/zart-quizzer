"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types/user"
import { getCurrentUser, login, logout, register, type LoginData, type RegisterData, refreshToken } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await getCurrentUser()
        setUser(user)
      } catch (err: any) {
        // If not authenticated, try to refresh token
        if (err.response?.status === 401 || err.response?.status === 403) {
          try {
            await refreshToken()
            const { user } = await getCurrentUser()
            setUser(user)
          } catch (refreshErr) {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Redirect logged-in users away from login/register/base
  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const path = window.location.pathname
      if (path === '/' || path === '/login' || path === '/register' || path === '/forgot-password' || path === '/oauth-success') {
        router.replace('/dashboard')
      }
    }
  }, [user, router])

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await login(data)
      setUser(response.user)
      toast({ title: "Login successful", description: "Welcome back!" })
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed")
      toast({
        title: "Login failed",
        description: err.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await register(data)
      setUser(response.user)
      toast({ title: "Registration successful", description: "Your account has been created" })
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed")
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      setUser(null)
      toast({ title: "Logged out", description: "You have been logged out successfully" })
      router.push("/login")
    } catch (err: any) {
      setError(err.response?.data?.message || "Logout failed")
      toast({
        title: "Logout failed",
        description: err.response?.data?.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}