"use client"

import Link from "next/link"
import { User, BookOpen, ImageIcon, DollarSign, Calendar } from "lucide-react"

const Button = ({ children, className, onClick, ...props }) => {
  const baseClasses =
    "rounded-full font-medium text-center inline-flex items-center justify-center transition-all duration-300 ease-in-out"
  const newClasses =
    "bg-transparent text-white hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:scale-105"

  return (
    <button
      className={`${baseClasses} ${newClasses} ${className} px-6 py-3`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 flex flex-wrap gap-6 justify-center items-center bg-black bg-opacity-70 p-4">
      {/* Top Left Logo */}
      <div className="absolute top-4 left-4 z-20">
        <Link href="/" className="text-2xl font-mono text-white">
          agent4<span className="text-orange-400">0</span>4
        </Link>
      </div>

      <div className="flex flex-wrap gap-6 justify-center items-center">
        <Link href="/whoami">
          <Button className="group">
            <User className="mr-3 h-4 w-4 text-orange-400 group-hover:animate-bounce-icon transition-colors duration-300" />
            whoami
          </Button>
        </Link>

        <Link href="/journal">
          <Button className="group">
            <BookOpen className="mr-3 h-4 w-4 text-orange-400 group-hover:animate-bounce-icon transition-colors duration-300" />
            journal
          </Button>
        </Link>

        <Link href="/calendar">
          <Button className="group">
            <Calendar className="mr-3 h-4 w-4 text-orange-400 group-hover:animate-bounce-icon transition-colors duration-300" />
            calendar
          </Button>
        </Link>

        <Link href="/gallery">
          <Button className="group">
            <ImageIcon className="mr-3 h-4 w-4 text-orange-400 group-hover:animate-bounce-icon transition-colors duration-300" />
            gallery
          </Button>
        </Link>

        <Link href="/tips">
          <Button className="group">
            <DollarSign className="mr-3 h-4 w-4 text-orange-400 group-hover:animate-bounce-icon transition-colors duration-300" />
            tips
          </Button>
        </Link>

        <Link href="/si-times">
          <Button className="group">
            <BookOpen className="mr-3 h-4 w-4 text-orange-400 group-hover:animate-bounce-icon transition-colors duration-300" />
            THETIMES
          </Button>
        </Link>
      </div>
    </div>
  )
}
