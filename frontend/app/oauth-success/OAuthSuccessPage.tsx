"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Cookies from "js-cookie"

export default function OAuthSuccessPage() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const accessToken = params.get("accessToken")
    const refreshToken = params.get("refreshToken")
    if (accessToken && refreshToken) {
      Cookies.set("accessToken", accessToken, { secure: true, sameSite: "strict" })
      Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "strict" })
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }
  }, [params, router])

  return <div>Logging you in...</div>
}