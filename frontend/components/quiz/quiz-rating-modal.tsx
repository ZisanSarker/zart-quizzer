"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { rateQuiz, getQuizRatingStats } from "@/lib/rating"

interface QuizRatingModalProps {
  quizId: string
  userId?: string
  isOpen: boolean
  onClose: () => void
  onRated: () => void
}

export function QuizRatingModal({ 
  quizId, 
  userId, 
  isOpen, 
  onClose, 
  onRated 
}: QuizRatingModalProps) {
  const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch current user rating on component mount
  useEffect(() => {
    const fetchUserRating = async () => {
      if (userId && quizId) {
        try {
          const data = await getQuizRatingStats(quizId)
          if (data.userRating) {
            setRating(data.userRating)
          }
        } catch (error) {
          console.error('Failed to fetch user rating:', error)
        }
      }
    }
    fetchUserRating()
  }, [userId, quizId])

  const handleRate = async (r: number) => {
    if (!userId) return
    setLoading(true)
    setRating(r)
    try {
      await rateQuiz(quizId, r)
      toast({ 
        title: r === rating ? "Rating updated!" : "Thank you for rating!",
        description: r === rating ? "Your rating has been updated." : "Your rating has been saved."
      })
      onRated()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to rate"
      toast({ 
        title: "Rating failed", 
        description: errorMessage,
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent className="max-w-md bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800">
        <DialogHeader>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle className="text-xl font-bold text-amber-800 dark:text-amber-200">
              Rate this Quiz
            </DialogTitle>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
              How would you rate this quiz?
            </p>
          </div>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 my-4">
          <div className="flex items-center justify-center gap-3 py-2">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
              <div className="relative">
                <button
                  key={i}
                  type="button"
                  aria-label={`Rate ${i}`}
                  disabled={loading}
                  onClick={() => handleRate(i)}
                  className={`transition-all duration-300 group ${
                    i <= rating 
                      ? "text-amber-500 scale-110" 
                      : "text-gray-300 dark:text-gray-600 scale-100 hover:text-amber-400 dark:hover:text-amber-400"
                  } hover:scale-125`}
                >
                  <Star 
                    className={`h-10 w-10 transition-all duration-300 ${
                      i <= rating 
                        ? "fill-amber-500 drop-shadow-lg" 
                        : "fill-none group-hover:fill-amber-200 dark:group-hover:fill-amber-800"
                    }`} 
                  />
                  {i <= rating && (
                    <div className="absolute inset-0 animate-pulse">
                      <Star className="h-10 w-10 text-amber-400 fill-amber-400 opacity-30" />
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
              Your feedback helps improve future quizzes!
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Click on a star to rate from 1 to 5 • You can update your rating anytime
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex justify-center gap-2">
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              Skip for now
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 