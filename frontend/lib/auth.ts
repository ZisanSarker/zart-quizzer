import api from "./api"
import type { User } from "@/types/user"

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: User
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data)
  return response.data
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data)
  return response.data
}

export const logout = async (): Promise<{ message: string }> => {
  const response = await api.get<{ message: string }>("/auth/logout")
  return response.data
}

export const getCurrentUser = async (): Promise<{ user: User }> => {
  const response = await api.get<{ user: User }>("/auth/me")
  return response.data
}

export const refreshToken = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/refresh-token")
  return response.data
}

// OAuth URLs
export const getGoogleAuthUrl = (): string => {
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google`
}

export const getGithubAuthUrl = (): string => {
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/github`
}

export const getFacebookAuthUrl = (): string => {
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/facebook`
}
