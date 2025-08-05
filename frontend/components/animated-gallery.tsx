"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface AnimatedGalleryProps {
  className?: string
}

export function AnimatedGallery({ className = "" }: AnimatedGalleryProps) {
  const [currentPosition, setCurrentPosition] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  // Define responsive positions for different screen sizes
  const positions = [
    // Default positions (will be overridden by CSS media queries)
    { top: "0%", left: "50%", transform: "translateX(-50%)" },
    { top: "70%", left: "20%", transform: "translateX(-50%)" },
    { top: "70%", left: "80%", transform: "translateX(-50%)" },
  ]

  // Motivational text content
  const motivationalTexts = [
    "Be Productive",
    "Gain Knowledge", 
    "Achieve Success",
    "Be Happy",
    "Learn Smart",
    "Grow Together",
    "Master Skills",
    "Stay Motivated"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosition((prev) => (prev + 1) % 3)
    }, 2000) // Slower animation - 2 seconds instead of 500ms

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % motivationalTexts.length)
    }, 2000) // Change text every 2 seconds to match photo rotation

    return () => clearInterval(textInterval)
  }, [])

  const images = [
    { src: "/landing1.png", alt: "Landing 1" },
    { src: "/landing2.png", alt: "Landing 2" },
    { src: "/landing3.png", alt: "Landing 3" },
  ]

  return (
    <div className={`relative w-full h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 ${className}`}>
      {/* Animated growing circle with text in center */}
      <div className="absolute top-2/3 xs:top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          {/* Simple circle with thin border */}
          <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center border border-gray-300 dark:border-white/30">
            {/* Text inside the circle */}
            <div className="text-center px-1 xs:px-1.5 sm:px-2">
              <div className="text-xs xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-gray-800 dark:text-white leading-tight tracking-wider" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
                {motivationalTexts[currentTextIndex]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {images.map((image, index) => {
        const positionIndex = (currentPosition + index) % 3
        const position = positions[positionIndex]
        
        return (
          <div
            key={index}
            className="absolute transition-all duration-1000 ease-in-out"
            style={{
              top: position.top,
              left: position.left,
              transform: position.transform,
            }}
          >
            <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 bg-white/20 dark:bg-purple-600/20 backdrop-blur-md rounded-lg border border-white/30 dark:border-purple-400/30 shadow-lg">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 480px) 80px, (max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, (max-width: 1280px) 160px, 192px"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
} 