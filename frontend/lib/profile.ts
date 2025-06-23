import api from "./api"
import type { Profile, SocialLinks, Badge } from "@/types/profile"

export interface UpdateProfilePayload {
  username?: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: SocialLinks
  badges?: Badge[]
}

export const getProfile = async (): Promise<{ profile: Profile }> => {
  const response = await api.get<{ profile: Profile }>("/profile/me")
  return response.data
}

export const updateProfile = async (data: UpdateProfilePayload): Promise<{ profile: Profile }> => {
  const response = await api.put<{ profile: Profile }>("/profile/me", data)
  return response.data
}