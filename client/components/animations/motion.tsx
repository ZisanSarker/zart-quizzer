"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const FadeUp = ({
  children,
  delay = 0,
  duration = 0.5,
  y = 20,
  className = "",
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const SlideRight = ({
  children,
  delay = 0,
  duration = 0.5,
  x = 50,
  className = "",
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  x?: number
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -x }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -x }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const SlideLeft = ({
  children,
  delay = 0,
  duration = 0.5,
  x = 50,
  className = "",
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  x?: number
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  ...props
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const StaggerChildren = ({
  children,
  staggerDelay = 0.1,
  className = "",
  ...props
}: {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({
  children,
  duration = 0.5,
  y = 20,
  className = "",
  ...props
}: {
  children: React.ReactNode
  duration?: number
  y?: number
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const AnimatedCounter = ({
  value,
  duration = 1.5,
  className = "",
  ...props
}: {
  value: number
  duration?: number
  className?: string
  [key: string]: any
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const updateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setDisplayValue(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue)
      }
    }

    animationFrame = requestAnimationFrame(updateValue)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return (
    <span className={className} {...props}>
      {displayValue}
    </span>
  )
}

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
