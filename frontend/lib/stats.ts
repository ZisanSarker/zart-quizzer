import api from "./api"
import type { UserStats } from "@/types/stats"

// Get statistics for current user (uses /api/statistics/me)
export const getMyStats = async (): Promise<UserStats> => {
  const response = await api.get<UserStats>("/statistics/me")
  return response.data
}

// Get statistics for any user by userId (admin or profile)
export const getUserStats = async (userId: string): Promise<UserStats> => {
  const response = await api.get<UserStats>(`/statistics/${userId}`)
  return response.data
}