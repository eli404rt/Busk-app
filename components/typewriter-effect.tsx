"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Music, DollarSign, BookOpen, Instagram } from "lucide-react"
import Link from "next/link"

export default function TypewriterEffect() {
  const texts = ["pity you didn't dedicate your life to Art", "LIFE⁴ (ART) = ¹LOVE"]

  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showButtons, setShowButtons] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const currentText = texts[currentTextIndex]

    if (currentIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentText[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 100)

      return () => clearTimeout(timeout)
    } else if (currentTextIndex < texts.length - 1) {
      // Move to next text after a pause
      const timeout = setTimeout(() => {
        setCurrentTextIndex((prev) => prev + 1)
        setDisplayedText("")
        setCurrentIndex(0)
      }, 2000)

      return () => clearTimeout(timeout)
    } else {
      // All texts complete, show buttons
      setIsComplete(true)
      const timeout = setTimeout(() => {
        setShowButtons(true)
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, currentTextIndex, texts])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative">
      <div className="text-white font-mono text-2xl md:text-4xl lg:text-5xl text-center leading-relaxed mb-8">
        <span>{displayedText}</span>
        <span className="animate-pulse inline-block w-1 h-8 md:h-12 lg:h-16 bg-white ml-1">|</span>
      </div>

      {showButtons && (
        <div className="flex flex-wrap gap-4 justify-center items-center animate-fade-in">
          <Button
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 opacity-0 animate-fade-in-delay-1"
            onClick={() => window.open("mailto:eli@example.com?subject=Song Request", "_blank")}
          >
            <Music className="mr-2 h-4 w-4" />
            Request Song
          </Button>

          <Button
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 opacity-0 animate-fade-in-delay-2"
            onClick={() => window.open("https://paypal.me/elicadieux", "_blank")}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Tip
          </Button>

          <Link href="/blog">
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 opacity-0 animate-fade-in-delay-3"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Blog
            </Button>
          </Link>

          <Button
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 opacity-0 animate-fade-in-delay-4"
            onClick={() => window.open("https://instagram.com/eli_cadieux", "_blank")}
          >
            <Instagram className="mr-2 h-4 w-4" />
            @eli_cadieux
          </Button>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay-1 {
          animation: fade-in 0.8s ease-out 0.2s forwards;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s forwards;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s forwards;
        }
        
        .animate-fade-in-delay-4 {
          animation: fade-in 0.8s ease-out 0.8s forwards;
        }
      `}</style>
    </div>
  )
}
