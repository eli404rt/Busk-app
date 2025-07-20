"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Music, DollarSign, BookOpen, Instagram } from "lucide-react"
import Link from "next/link"

const quotes = [
  `pity you didn't dedicate your life to Art`,
  `LIFE⁴ (ART) = ¹LOVE`,
  `Music speaks where words fail.`,
  `Every heartbeat is a drum, every breath a note.`,
  `The digital revolution has expanded art's possibilities infinitely.`,
] // You can add 10-20 quotes here

const TYPING_SPEED = 80 // milliseconds per character
const DELETING_SPEED = 50 // milliseconds per character
const PAUSE_AFTER_TYPE = 1500 // milliseconds
const PAUSE_AFTER_DELETE = 700 // milliseconds
const BUTTON_FADE_IN_PERCENTAGE = 0.7 // Percentage of the first quote length

export default function TypewriterEffect() {
  const [displayedText, setDisplayedText] = useState("")
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showButtons, setShowButtons] = useState(false)

  const currentQuote = quotes[quoteIndex]

  const handleTyping = useCallback(() => {
    if (!isDeleting) {
      if (charIndex < currentQuote.length) {
        setDisplayedText(currentQuote.substring(0, charIndex + 1))
        setCharIndex((prev) => prev + 1)
        // Show buttons when a certain percentage of the first quote is typed
        if (quoteIndex === 0 && charIndex >= Math.floor(currentQuote.length * BUTTON_FADE_IN_PERCENTAGE) && !showButtons) {
          setShowButtons(true)
        }
      } else {
        setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE)
      }
    } else {
      if (charIndex > 0) {
        setDisplayedText(currentQuote.substring(0, charIndex - 1))
        setCharIndex((prev) => prev - 1)
      } else {
        setIsDeleting(false)
        setQuoteIndex((prev) => (prev + 1) % quotes.length)
        setTimeout(() => {}, PAUSE_AFTER_DELETE) // Short pause before next typing starts
      }
    }
  }, [charIndex, currentQuote, isDeleting, quoteIndex, showButtons])

  useEffect(() => {
    const timer = setTimeout(
      handleTyping,
      isDeleting ? DELETING_SPEED : TYPING_SPEED,
    )
    return () => clearTimeout(timer)
  }, [handleTyping, isDeleting])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative">
      <div className="text-white font-mono text-xl md:text-3xl lg:text-4xl text-center leading-relaxed mb-12 max-w-4xl">
        <pre className="whitespace-pre-wrap font-mono">{displayedText}</pre>
        <span className="inline-block w-1 h-6 md:h-8 lg:h-10 bg-white ml-1 animate-cursor-blink"></span>
      </div>

      {showButtons && (
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <Link href="/song-request">
            <Button
              variant="ghost"
              className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-500 opacity-0 animate-fade-in-delay-1 px-8 py-3 text-lg"
            >
              <Music className="mr-3 h-5 w-5" />
              Request Song
            </Button>
          </Link>

          <Link href="/tip">
            <Button
              variant="ghost"
              className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-500 opacity-0 animate-fade-in-delay-2 px-8 py-3 text-lg"
            >
              <DollarSign className="mr-3 h-5 w-5" />
              Tip
            </Button>
          </Link>

          <Link href="/blog">
            <Button
              variant="ghost"
              className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-500 opacity-0 animate-fade-in-delay-3 px-8 py-3 text-lg"
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Blog
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-500 opacity-0 animate-fade-in-delay-4 px-8 py-3 text-lg"
            onClick={() => window.open("https://instagram.com/eli_cadieux", "_blank")}
          >
            <Instagram className="mr-3 h-5 w-5" />
            @eli_cadieux
          </Button>
        </div>
      )}
    </div>
  )
}