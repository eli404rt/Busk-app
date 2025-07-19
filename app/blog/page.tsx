"use client"

import { useState, useMemo } from "react"
import { BlogHeader } from "@/components/blog-header"
import { BlogPostCard } from "@/components/blog-post-card"
import { getBlogPosts, getFeaturedPosts, searchBlogPosts } from "@/lib/blog-data"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const allPosts = getBlogPosts()
  const featuredPosts = getFeaturedPosts()

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return allPosts
    return searchBlogPosts(searchQuery)
  }, [searchQuery, allPosts])

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader onSearch={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!searchQuery && featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Posts</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} featured />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "All Posts"}
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery ? "No posts found matching your search." : "No posts available."}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
