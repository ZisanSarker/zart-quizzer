"use client"

import Lottie from "lottie-react"
import { useEffect, useRef, useState } from "react"

interface LottieAnimationProps {
  animationData?: any
  animationPath?: string
  className?: string
  loop?: boolean
  autoplay?: boolean
  style?: React.CSSProperties
}

export function LottieAnimation({ 
  animationData, 
  animationPath,
  className = "", 
  loop = true, 
  autoplay = true,
  style = {}
}: LottieAnimationProps) {
  const lottieRef = useRef<any>(null)
  const [loadedAnimationData, setLoadedAnimationData] = useState<any>(animationData)
  const [isLoading, setIsLoading] = useState(false)

  // Load animation data from path if provided
  useEffect(() => {
    if (animationPath && !animationData) {
      setIsLoading(true)
      fetch(animationPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
          setLoadedAnimationData(data)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Failed to load animation:', error)
          setIsLoading(false)
        })
    }
  }, [animationPath, animationData])

  useEffect(() => {
    if (lottieRef.current && loadedAnimationData) {
      lottieRef.current.play()
    }
  }, [loadedAnimationData])

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!loadedAnimationData) {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <div className="text-muted-foreground">Animation not available</div>
      </div>
    )
  }

  return (
    <div className={`flex justify-center items-center ${className}`} style={{ minHeight: '200px', minWidth: '200px' }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={loadedAnimationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%', ...style }}
        className="w-full h-full"
      />
    </div>
  )
} 