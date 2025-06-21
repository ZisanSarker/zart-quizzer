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

  // Expose a function to manually refresh user (useful for silent refresh or role change)
  const refreshUser = useCallback(async () => {
    setIsLoading(true)
    try {
      const { user } = await getCurrentUser()
      setUser(user)
    } catch (err: any) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial check (and refreshToken fallback)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await getCurrentUser()
        setUser(user)
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
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
      }
    }
    checkAuth()
  }, [])

  // Page handles toast and redirect. Just throw on error and set state here.
  const handleLogin = async (data: LoginData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await login(data)
      setUser(response.user)
      return response.user
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed")
      throw err
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
      return response.user
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      setUser(null)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Logout failed")
      throw err
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