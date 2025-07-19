"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Home } from "lucide-react"

interface BlogHeaderProps {
  onSearch?: (query: string) => void
}

export function BlogHeader({ onSearch }: BlogHeaderProps) {
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-white">
              Eli's Art & Life
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                All Posts
              </Link>
              <Link href="/blog/category/philosophy" className="text-gray-300 hover:text-white transition-colors">
                Philosophy
              </Link>
              <Link href="/blog/category/music" className="text-gray-300 hover:text-white transition-colors">
                Music
              </Link>
              <Link href="/blog/category/technology" className="text-gray-300 hover:text-white transition-colors">
                Technology
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-10 w-64 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-500"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
