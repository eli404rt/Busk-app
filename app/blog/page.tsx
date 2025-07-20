"use client"

import { useState, useMemo } from "react"
import { BlogHeader } from "@/components/blog-header"
import { BlogPostCard } from "@/components/blog-post-card"
import { getBlogPosts, searchBlogPosts } from "@/lib/blog-data"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const allPosts = getBlogPosts()

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return allPosts
    return searchBlogPosts(searchQuery)
  }, [searchQuery, allPosts])

  return (
    <div className="min-h-screen bg-black">
      <BlogHeader onSearch={setSearchQuery} />

      <main className="max-w-4xl mx-auto px-4 pb-16">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">{searchQuery ? "nothing found" : "no posts"}</p>
          </div>
        ) : (
          <div>
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
