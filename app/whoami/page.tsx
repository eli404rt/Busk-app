"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const whoamiLines = [
  "I am a digital wanderer,",
  "a creator of music and words.",
  "My art is a reflection of my soul,",
  "a journey of authentic expression.",
  "I am agent404,",
  "lost but always searching.",
]

const TYPING_SPEED = 80
const DELETING_SPEED = 50
const PAUSE_AFTER_TYPE = 2000
const PAUSE_AFTER_DELETE = 500

export default function WhoAmIPage() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleTyping = useCallback(() => {
    if (currentLineIndex >= whoamiLines.length) {
      setIsComplete(true)
      return
    }

    const currentLine = whoamiLines[currentLineIndex]
    const isOddLine = currentLineIndex % 2 === 1

    if (!isDeleting) {
      if (currentCharIndex < currentLine.length) {
        const newLines = [...displayedLines]
        newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1)
        setDisplayedLines(newLines)
        setCurrentCharIndex((prev) => prev + 1)
      } else {
        // Line complete, pause then decide what to do
        setTimeout(() => {
          if (isOddLine) {
            // Delete odd lines (orange, right-justified)
            setIsDeleting(true)
          } else {
            // Keep even lines, move to next
            setCurrentLineIndex((prev) => prev + 1)
            setCurrentCharIndex(0)
          }
        }, PAUSE_AFTER_TYPE)
      }
    } else {
      // Deleting
      if (currentCharIndex > 0) {
        const newLines = [...displayedLines]
        newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex - 1)
        setDisplayedLines(newLines)
        setCurrentCharIndex((prev) => prev - 1)
      } else {
        // Deletion complete, move to next line
        setIsDeleting(false)
        setCurrentLineIndex((prev) => prev + 1)
        setCurrentCharIndex(0)
        setTimeout(() => {}, PAUSE_AFTER_DELETE)
      }
    }
  }, [currentLineIndex, currentCharIndex, isDeleting, displayedLines])

  useEffect(() => {
    if (!isComplete) {
      const timer = setTimeout(handleTyping, isDeleting ? DELETING_SPEED : TYPING_SPEED)
      return () => clearTimeout(timer)
    }
  }, [handleTyping, isDeleting, isComplete])

  return (
    <div className="min-h-screen bg-black">
      

      <main className="flex flex-col items-center justify-center min-h-[80vh] px-8">
        <div className="w-full max-w-4xl">
          {displayedLines.map((line, index) => {
            const isOddLine = index % 2 === 1
            const isCurrentLine = index === currentLineIndex

            return (
              <div
                key={index}
                className={`font-mono text-xl md:text-3xl lg:text-4xl leading-relaxed mb-4 ${
                  isOddLine ? "text-orange-400 text-right" : "text-white text-left"
                }`}
              >
                {line}
                {isCurrentLine && (
                  <span className="inline-block w-1 h-6 md:h-8 lg:h-10 bg-white ml-2 animate-pulse"></span>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
