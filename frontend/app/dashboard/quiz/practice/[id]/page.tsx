"use client"

import { useQuizPracticeData } from "@/hooks/use-quiz-practice-data"
import { QuizPracticeHeader } from "@/components/quiz/quiz-practice-header"
import { QuizPracticeQuestion } from "@/components/quiz/quiz-practice-question"
import { QuizPracticeActions } from "@/components/quiz/quiz-practice-actions"
import { QuizRatingModal } from "@/components/quiz/quiz-rating-modal"
import { FadeIn } from "@/components/animations/motion"
import { useAuth } from "@/contexts/auth-context"

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
      <QuizPracticeHeader
        quiz={quiz}
        showRateButton={showRateButton}
        hasRated={hasRated}
        onShareQuiz={handleShareQuiz}
        onRateButtonClick={handleRateButtonClick}
      />

      <FadeIn>
        <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
          {quiz.questions.map((question, index) => {
            const userAnswer = selectedAnswers[question._id]
            const checked = checkedAnswers[question._id]
            const isCorrect = userAnswer === question.correctAnswer
            return (
              <QuizPracticeQuestion
                key={question._id}
                question={question}
                index={index}
                userAnswer={userAnswer}
                checked={checked}
                isCorrect={isCorrect}
                onOptionClick={handleOptionClick}
              />
            )
          })}
        </div>
      </FadeIn>

      <QuizPracticeActions
        practiceSubmitted={practiceSubmitted}
        onResetPractice={handleResetPractice}
        onFinishPractice={handleFinishPractice}
      />

      <QuizRatingModal
        quizId={quiz._id}
        userId={user?._id}
        isOpen={showRatingModal}
        onClose={handleModalClose}
        onRated={handleRated}
      />
    </>
  )
}