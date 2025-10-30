"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false)

  const refreshUser = useCallback(async () => {
    if (isLoading) return
    try {
      const { user } = await getCurrentUser()
      setUser(user)
    } catch (err: any) {
      setUser(null)
    }
  }, [isLoading])

  useEffect(() => {
    const checkAuth = async () => {
      if (isInitialized) return
      
      try {
        const { user } = await getCurrentUser()
        setUser(user)
      } catch (err: any) {
        if ((err.response?.status === 401 || err.response?.status === 403) && !hasAttemptedRefresh) {
          setHasAttemptedRefresh(true)
          try {
            await refreshToken()
            const { user } = await getCurrentUser()
            setUser(user)
          } catch {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }
    
    const timer = setTimeout(() => {
      checkAuth()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [isInitialized, hasAttemptedRefresh])

  const handleLogin = async (data: LoginData) => {
    setError(null)
    setHasAttemptedRefresh(false)
    try {
      const response = await login(data)
      setUser(response.user)
      return response.user
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed")
      throw err
    }
  }

  const handleRegister = async (data: RegisterData) => {
    setError(null)
    setHasAttemptedRefresh(false)
    try {
      const response = await register(data)
      setUser(response.user)
      return response.user
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed")
      throw err
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      clearAccessToken()
      setUser(null)
      setHasAttemptedRefresh(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Logout failed")
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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}