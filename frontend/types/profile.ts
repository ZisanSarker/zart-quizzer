export interface SocialLinks {
  twitter?: string
  linkedin?: string
  github?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
}

export interface Stats {
  quizzesCreated: number
  quizzesTaken: number
  averageScore: number
  followers: number
  following: number
}

export interface Profile {
  _id: string
  userId: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: SocialLinks
  badges?: Badge[]
  createdAt: string
  updatedAt: string
  userIdObj: {
    username: string
    email: string
    profilePicture: string
    createdAt: string
  }
  stats: Stats
}