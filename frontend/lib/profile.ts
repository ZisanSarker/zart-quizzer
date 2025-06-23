import api from "./api"
import type { Profile, SocialLinks, Stats, Badge } from "@/types/profile"

export const getProfile = async (): Promise<{ profile: Profile }> => {
  const response = await api.get<{ profile: Profile }>("/profile/me")
  return response.data
}

export const updateProfile = async (data: Partial<Pick<Profile, 'bio' | 'location' | 'website' | 'socialLinks' | 'badges'>>): Promise<{ profile: Profile }> => {
  const response = await api.put<{ profile: Profile }>("/profile/me", data)
  return response.data
}