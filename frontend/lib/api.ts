import axios from "axios"
import { refreshToken } from "./auth"
import { getAccessToken } from "./session"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

const isAuthPage = (): boolean => {
  if (typeof window === 'undefined') return false
  const path = window.location.pathname
  return path === '/login' || path === '/register' || path === '/auth' || path.startsWith('/auth/')
}

const shouldRedirectToLogin = (): boolean => {
  if (typeof window === 'undefined') return false
  const path = window.location.pathname
  return !isAuthPage() && path !== '/'
}

// Attach Authorization header if an in-memory access token exists.
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    ;(config.headers as any)["Authorization"] = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60
      console.warn(`Rate limited. Retry after ${retryAfter} seconds.`)
      return Promise.reject(new Error('Too many requests. Please try again later.'))
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => {
          return api(originalRequest)
        }).catch((err) => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await refreshToken()
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false
        
        // Only redirect if we're on a protected page
        if (shouldRedirectToLogin()) {
          console.log('🔄 Redirecting to login due to authentication failure')
          setTimeout(() => {
            window.location.href = '/login'
          }, 100)
        }
        return Promise.reject(refreshError)
      } finally {
        if (isRefreshing) {
          isRefreshing = false
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api
