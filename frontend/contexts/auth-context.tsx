"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types/user"
import {
  getCurrentUser,
  login,
  logout,
  register,
  type LoginData,
  type RegisterData,
  refreshToken
} from "@/lib/auth"
import { clearAccessToken } from "@/lib/session"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<User>
  register: (data: RegisterData) => Promise<User>
  logout: () => Promise<void>
  error: string | null
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // React 19: Simplified effect without excessive useCallback
  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      try {
        const { user } = await getCurrentUser()
        if (mounted) setUser(user)
      } catch (err: unknown) {
        const error = err as { response?: { status?: number } }
        if (error.response?.status === 401 || error.response?.status === 403) {
          try {
            await refreshToken()
            const { user } = await getCurrentUser()
            if (mounted) setUser(user)
          } catch {
            if (mounted) setUser(null)
          }
        } else {
          if (mounted) setUser(null)
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [])

  // React 19: Simple function, no useCallback needed
  async function refreshUser() {
    if (isLoading) return
    try {
      const { user } = await getCurrentUser()
      setUser(user)
    } catch {
      setUser(null)
    }
  }

  // React 19: Simple async functions
  async function handleLogin(data: LoginData) {
    setError(null)
    try {
      const response = await login(data)
      setUser(response.user)
      return response.user
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || "Login failed")
      throw err
    }
  }

  async function handleRegister(data: RegisterData) {
    setError(null)
    try {
      const response = await register(data)
      setUser(response.user)
      return response.user
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || "Registration failed")
      throw err
    }
  }

  async function handleLogout() {
    try {
      await logout()
      clearAccessToken()
      setUser(null)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || "Logout failed")
      throw err
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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}