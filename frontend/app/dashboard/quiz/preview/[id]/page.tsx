"use client"

import { useQuizData } from "@/hooks/use-quiz-data"
import { QuizHeader, QuizQuestion, QuizLoading, QuizNotFound } from "@/components/dashboard"

export default function QuizPreviewPage() {
  const {
    quiz,
    loading,
    currentQuestion,
    selectedAnswers,
    timeLeft,
    quizCompleted,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleShareQuiz
  } = useQuizData()

  if (loading) {
    return <QuizLoading />
  }

  if (!quiz) {
    return <QuizNotFound />
  }

  const question = quiz.questions[currentQuestion]
  const isLastQuestion = currentQuestion === quiz.questions.length - 1
  const selectedAnswer = selectedAnswers[question._id] || ""

  return (
    <>
      <QuizHeader
        title={quiz.topic}
        isCompleted={quizCompleted}
        onShare={handleShareQuiz}
      />

      <QuizQuestion
        question={question}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNextQuestion}
        onPrevious={handlePreviousQuestion}
        currentQuestion={currentQuestion}
        totalQuestions={quiz.questions.length}
        isLastQuestion={isLastQuestion}
      />
    </>
  )
}