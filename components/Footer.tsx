"use client"

import { Instagram, Facebook, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-6">
      <a
        href="https://instagram.com/eli_cadieux"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-gray-300 transition-colors duration-300"
      >
        <Instagram className="h-8 w-8" />
      </a>
      <a
        href="https://facebook.com/eli_cadieux"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-gray-300 transition-colors duration-300"
      >
        <Facebook className="h-8 w-8" />
      </a>
      <a
        href="https://youtube.com/@eli_cadieux"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-gray-300 transition-colors duration-300"
      >
        <Youtube className="h-8 w-8" />
      </a>
    </div>
  )
}
