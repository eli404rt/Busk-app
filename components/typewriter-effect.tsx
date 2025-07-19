"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Music, DollarSign, BookOpen, Instagram } from "lucide-react"
import Link from "next/link"

export default function TypewriterEffect() {
  const fullText = `pity you didn't dedicate your life to Art

LIFE⁴ (ART) = ¹LOVE`

  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showButtons, setShowButtons] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[currentIndex])
        setCurrentIndex((prev) => prev + 1)

        // Show buttons when 70% of text is typed
        if (currentIndex >= Math.floor(fullText.length * 0.7) && !showButtons) {
          setTimeout(() => {
            setShowButtons(true)
          }, 500)
        }
      }, 80)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, fullText, showButtons])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative">
      <div className="text-white font-mono text-xl md:text-3xl lg:text-4xl text-center leading-relaxed mb-12 max-w-4xl">
        <pre className="whitespace-pre-wrap font-mono">{displayedText}</pre>
        <span className="animate-pulse inline-block w-1 h-6 md:h-8 lg:h-10 bg-white ml-1">|</span>
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
