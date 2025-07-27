"use client" // This must be the absolute first line of the file

import { useState, useEffect, useCallback } from "react"

const quotes = [
  `Perhaps we can't stop war.`,
  `War is the death of imagination`,
  `Imagination has many enemies`,
  `Children have no enemies.`,
  `Children are the birth of imagination.`,
  `Perhaps we CAN stop war... ?`,
  `Thanks for helping me write that.`,
  `Gord Downie (September 16th, 2000) Treaty One Territory, The Forks Winnipeg, Canada`,
  `I only tell you this Courage, because you're a friend of mine. If my name was courage, I'd wanna be on time`,
  `You ain't good looking, and your name is Courage. You better be on time.`,
] // Quotes from Gord Downie / The Tragically Hip

const TYPING_SPEED = 80 // milliseconds per character
const DELETING_SPEED = 50 // milliseconds per character
const PAUSE_AFTER_TYPE = 3000 // milliseconds (Increased pause before deleting)
const PAUSE_AFTER_DELETE = 700 // milliseconds

export default function TypewriterEffect() {
  const [displayedText, setDisplayedText] = useState("")
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const currentQuote = quotes[quoteIndex]

  const handleTyping = useCallback(() => {
    if (!isDeleting) {
      if (charIndex < currentQuote.length) {
        setDisplayedText(currentQuote.substring(0, charIndex + 1))
        setCharIndex((prev) => prev + 1)
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
  }, [charIndex, currentQuote, isDeleting, quoteIndex])

  useEffect(() => {
    const timer = setTimeout(handleTyping, isDeleting ? DELETING_SPEED : TYPING_SPEED)
    return () => clearTimeout(timer)
  }, [handleTyping, isDeleting])

  // Determine if the cursor should be visible
  const isCursorVisible = !isDeleting || (isDeleting && charIndex > 0)

  return (
    <div className="min-h-screen bg-black flex flex-col items-center relative">
      {/* Custom CSS for animations */}
      <style>{`
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
        /* New bounce animation for icons */
        @keyframes bounce-icon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-fade-in-delay-1 {
          animation: fade-in 0.6s ease-out forwards;
          animation-delay: 0.1s;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out forwards;
          animation-delay: 0.2s;
        }
        .animate-fade-in-delay-3 {
          animation: fade-in 0.6s ease-out forwards;
          animation-delay: 0.3s;
        }
        .animate-fade-in-delay-4 {
          animation: fade-in 0.6s ease-out forwards;
          animation-delay: 0.4s;
        }
      `}</style>

      <div className="flex flex-col items-center justify-center flex-grow px-8">
        <div className="text-white font-mono text-xl md:text-3xl lg:text-4xl text-center leading-relaxed mb-12 max-w-4xl">
          <pre className="whitespace-pre-wrap font-mono inline">
            {displayedText}
            {/* Cursor element placed directly after displayedText without italic-cursor class */}
            {isCursorVisible && (
              <span className="inline-block w-1 h-6 md:h-8 lg:h-10 bg-white ml-2 animate-cursor-blink"></span>
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}
