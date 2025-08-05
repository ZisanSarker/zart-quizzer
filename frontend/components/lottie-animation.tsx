"use client"

import Lottie from "lottie-react"
import { useEffect, useRef } from "react"

interface LottieAnimationProps {
  animationData: any
  className?: string
  loop?: boolean
  autoplay?: boolean
  style?: React.CSSProperties
}

export function LottieAnimation({ 
  animationData, 
  className = "", 
  loop = true, 
  autoplay = true,
  style = {}
}: LottieAnimationProps) {
  const lottieRef = useRef<any>(null)

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play()
    }
  }, [])

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={style}
        className="w-full h-full"
      />
    </div>
  )
} 