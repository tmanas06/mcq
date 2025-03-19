"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { mcqData } from "@/lib/mcq-data"

export default function QuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const count = Number.parseInt(searchParams?.get("count") || "10")

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<typeof mcqData>([])
  const [revealAnswer, setRevealAnswer] = useState(false)

  useEffect(() => {
    // For demo purposes, we'll use the sample data
    // In a real app, you would select 'count' random questions from the full dataset
    const questions = count === 10 ? mcqData.slice(0, 10) : mcqData
    setQuizQuestions(questions)
  }, [count])

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: value,
    })
  }

  const handleNextQuestion = () => {
    setRevealAnswer(false)
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const handlePreviousQuestion = () => {
    setRevealAnswer(false)
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleRevealAnswer = () => {
    setRevealAnswer(true)
  }

  const calculateScore = () => {
    let correctCount = 0

    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++
      }
    })

    return {
      correct: correctCount,
      total: quizQuestions.length,
      percentage: Math.round((correctCount / quizQuestions.length) * 100),
    }
  }

  if (quizQuestions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-center">Loading questions...</p>
      </div>
    )
  }

  if (quizCompleted) {
    const score = calculateScore()

    return (
      <div className="h-screen flex flex-col items-center justify-center py-12">
        <h2 className="text-3xl font-bold mb-4 text-center">Quiz Results</h2>
        <div className="flex justify-center mb-4">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">{score.percentage}%</h3>
          <p className="text-muted-foreground">
            You got {score.correct} out of {score.total} questions correct
          </p>
        </div>

        <Progress value={score.percentage} className="h-2 w-full max-w-md" />

        <div className="space-y-4 max-w-md">
          <h4 className="font-medium">Question Summary:</h4>
          <div className="space-y-2">
            {quizQuestions.map((question, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className={`h-2 w-2 rounded-full ${selectedAnswers[index] === question.correctAnswer ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span className="truncate">
                  Question {index + 1}:{" "}
                  {selectedAnswers[index] === question.correctAnswer ? "Correct" : "Incorrect"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={() => router.push("/")} className="w-full max-w-md mt-8">
          Return to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center py-12">
      <div className="flex justify-between items-center mb-2 w-full max-w-3xl text-center">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </span>
        <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
      </div>
      <Progress value={progress} className="h-2 w-full max-w-3xl" />
      <h2 className="text-2xl font-bold mt-4 w-full max-w-3xl text-center">{currentQuestion.question}</h2>

      <div className="space-y-3 w-full max-w-3xl">
        <RadioGroup
          value={selectedAnswers[currentQuestionIndex] || ""}
          onValueChange={handleAnswerSelect}
        >
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <div
              key={key}
              className="flex items-start space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value={key} id={`option-${key}`} className="mt-1" />
              <Label htmlFor={`option-${key}`} className="flex-1 cursor-pointer font-normal">
                <span className="font-medium">{key}.</span> {value}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between w-full max-w-3xl mt-4">
        <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleNextQuestion} disabled={!selectedAnswers[currentQuestionIndex]}>
          {currentQuestionIndex === quizQuestions.length - 1 ? "Finish" : "Next"}{" "}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={handleRevealAnswer}>
          Reveal Answer
        </Button>
      </div>

      {revealAnswer && (
        <div className="text-center mt-4">
          <p className="font-medium">Correct Answer: {currentQuestion.correctAnswer}</p>
        </div>
      )}
    </div>
  )
}
