"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useQuizPracticeData } from "@/hooks/use-quiz-practice-data"
import { 
  LazyQuizPracticeHeader, 
  LazyQuizPracticeQuestion, 
  LazyQuizPracticeActions, 
  LazyQuizRatingModal 
} from "@/components/lazy-components"
import { useAuth } from "@/contexts/auth-context"

const FadeIn = dynamic(() => import('@/components/animations/motion').then(mod => mod.FadeIn), {
  ssr: false,
})

export default function QuizPracticeAllPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const {
    quiz,
    loading,
    selectedAnswers,
    checkedAnswers,
    practiceSubmitted,
    showRatingModal,
    showRateButton,
    hasRated,
    handleOptionClick,
    handleShareQuiz,
    handleResetPractice,
    handleFinishPractice,
    handleModalClose,
    handleRated,
    handleRateButtonClick,
    setShowRatingModal
  } = useQuizPracticeData(params.id)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-2">Loading quiz...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your quiz</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz not found</h2>
          <p className="text-muted-foreground mb-4">The quiz you're looking for doesn't exist or has been removed</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Suspense fallback={<div className="h-20 bg-muted rounded animate-pulse mb-6" />}>
        <LazyQuizPracticeHeader
          quiz={quiz}
          showRateButton={showRateButton}
          hasRated={hasRated}
          onShareQuiz={handleShareQuiz}
          onRateButtonClick={handleRateButtonClick}
        />
      </Suspense>

      <FadeIn>
        <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
          {quiz.questions.map((question, index) => {
            const userAnswer = selectedAnswers[question._id]
            const checked = checkedAnswers[question._id]
            const isCorrect = userAnswer === question.correctAnswer
            return (
              <Suspense 
                key={question._id}
                fallback={<div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => (<div key={i} className="h-12 bg-muted rounded animate-pulse" />))}
                  </div>
                </div>}
              >
                <LazyQuizPracticeQuestion
                  question={question}
                  index={index}
                  userAnswer={userAnswer}
                  checked={checked}
                  isCorrect={isCorrect}
                  onOptionClick={handleOptionClick}
                />
              </Suspense>
            )
          })}
        </div>
      </FadeIn>

      <Suspense fallback={<div className="h-16 bg-muted rounded animate-pulse mt-6" />}>
        <LazyQuizPracticeActions
          practiceSubmitted={practiceSubmitted}
          onResetPractice={handleResetPractice}
          onFinishPractice={handleFinishPractice}
        />
      </Suspense>

      <LazyQuizRatingModal
        quizId={quiz._id}
        userId={user?._id}
        isOpen={showRatingModal}
        onClose={handleModalClose}
        onRated={handleRated}
      />
    </>
  )
}