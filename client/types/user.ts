export interface User {
  _id: string
  username: string
  email: string
  profilePicture: string
  role: "user" | "admin"
  isActive: boolean
  isEmailVerified: boolean
  lastLogin: string | null
  provider: "local" | "google" | "github" | "facebook"
  createdAt: string
  updatedAt: string
}
