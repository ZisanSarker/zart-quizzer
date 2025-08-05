"use client"

import type React from "react"

export default function SharedFooter() {
  return (
    <footer className="w-full py-4 text-center text-sm text-muted-foreground">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-3xl mx-4 sm:mx-8 lg:mx-12 border border-white/30 dark:border-white/10 shadow-lg py-3 sm:py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            &copy; {new Date().getFullYear()} ZART Quizzer. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
} 