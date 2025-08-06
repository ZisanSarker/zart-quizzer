"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { rateQuiz, getQuizRatingStats } from "@/lib/rating"

interface QuizRatingProps {
  quizId: string
  userId?: string
  onRated?: (value: number) => void
  initialValue?: number
}

export function QuizRating({ 
  quizId, 
  userId, 
  onRated, 
  initialValue = 0 
}: QuizRatingProps) {
  const [rating, setRating] = useState(initialValue)
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
      if (onRated) onRated(r)
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
    <div className="flex items-center justify-center gap-3 py-2">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
        <div key={i} className="relative">
          <button
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
          </button>
        </div>
      ))}
    </div>
  )
} 