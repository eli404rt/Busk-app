"use client" // This must be the absolute first line of the file

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button" // Assuming this path is correct for a Next.js project
import { Music, DollarSign, BookOpen, Instagram } from "lucide-react"

const quotes = [
  `pity you didn't dedicate your life to Art`,
  `LIFE⁴ (ART) = ¹LOVE`,
  `Music speaks where words fail.`,
  `Every heartbeat is a drum, every breath a note.`,
  `The digital revolution has expanded art's possibilities infinitely.`,
  `Art is not what you see, but what you make others see.`,
  `Where words leave off, music begins.`,
  `The artist is nothing without the gift, but the gift is nothing without work.`,
  `Creativity takes courage.`,
  `Every artist was first an amateur.`,
] // Added more quotes for better variety

const TYPING_SPEED = 80 // milliseconds per character
const DELETING_SPEED = 50 // milliseconds per character
const PAUSE_AFTER_TYPE = 3000 // milliseconds (Increased pause before deleting)
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
        // Pause after typing, then start deleting
        setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE)
      }
    } else {
      if (charIndex > 0) {
        setDisplayedText(currentQuote.substring(0, charIndex - 1))
        setCharIndex((prev) => prev - 1)
      } else {
        // Pause after deleting, then move to the next quote and start typing
        setIsDeleting(false)
        setQuoteIndex((prev) => (prev + 1) % quotes.length)
        setTimeout(() => {}, PAUSE_AFTER_DELETE)
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

  // Determine if the cursor should be visible
  const isCursorVisible = !isDeleting || (isDeleting && charIndex > 0);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative">
      {/* Custom CSS for animations */}
      <style>{` {/* Removed jsx attribute */}
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-cursor-blink {
          animation: cursor-blink 0.8s infinite step-end;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in-delay-1 {
          animation: fade-in 0.6s ease-out forwards;
          animation-delay: 0.5s; /* Initial delay for the first button */
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out forwards;
          animation-delay: 0.7s;
        }
        .animate-fade-in-delay-3 {
          animation: fade-in 0.6s ease-out forwards;
          animation-delay: 0.9s;
        }
        .animate-fade-in-delay-4 {
          animation: fade-in 0.6s ease-out forwards;
          animation-delay: 1.1s;
        }
        /* Removed style for the italicized cursor */
      `}</style>

      <div className="text-white font-mono text-xl md:text-3xl lg:text-4xl text-center leading-relaxed mb-12 max-w-4xl">
        <pre className="whitespace-pre-wrap font-mono inline">
          {displayedText}
          {/* Cursor element placed directly after displayedText without italic-cursor class */}
          {isCursorVisible && (
            <span className="inline-block w-1 h-6 md:h-8 lg:h-10 bg-white ml-2 animate-cursor-blink"></span>
          )}
        </pre>
      </div>

      {showButtons && (
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <a href="/song-request">
            <Button
              variant="ghost"
              className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-500 opacity-0 animate-fade-in-delay-1 px-8 py-3 text-lg"
            >
              <Music className="mr-3 h-5 w-5" />
              Request Song
            </Button>
          </a>

          <a href="/tip">
            <Button
              variant="ghost"
              className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-500 opacity-0 animate-fade-in-delay-2 px-8 py-3 text-lg"
            >
              <DollarSign className="mr-3 h-5 w-5" />
              Tip
            </Button>
          </a>

          <a href="/blog">
            <Button
              variant="ghost"
              className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-500 opacity-0 animate-fade-in-delay-3 px-8 py-3 text-lg"
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Blog
            </Button>
          </a>

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
