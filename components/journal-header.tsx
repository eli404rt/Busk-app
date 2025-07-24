"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Home, DollarSign } from "lucide-react"

interface JournalHeaderProps {
  onSearch?: (query: string) => void
}

export function JournalHeader({ onSearch }: JournalHeaderProps) {
  return (
    <header className="bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-xl font-mono text-white">
            agent4<span className="text-orange-400">0</span>4
          </Link>
          <nav className="flex gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/tip">
              <Button variant="ghost" size="icon" className="text-white">
                <DollarSign className="h-5 w-5" />
              </Button>
            </Link>
          </nav>
        </div>
        {onSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search entries..."
              className="w-full pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-400"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        )}
      </div>
    </header>
  )
}
