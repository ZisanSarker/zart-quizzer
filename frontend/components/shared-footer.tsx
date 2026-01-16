"use client"

export default function SharedFooter() {
  return (
    <footer className="w-full py-4 px-4 sm:px-6 text-center text-sm text-muted-foreground">
      <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/30 dark:border-white/10 shadow-lg py-3 sm:py-4 px-4 sm:px-6">
        &copy; {new Date().getFullYear()} ZART Quizzer. All rights reserved.
      </div>
    </footer>
  )
} 