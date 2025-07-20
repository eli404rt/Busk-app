import { BlogHeader } from "@/components/blog-header"
import { BlogPostCard } from "@/components/blog-post-card"
import { getBlogPostsByTag } from "@/lib/blog-data"
import { notFound } from "next/navigation"

interface TagPageProps {
  params: {
    tag: string
  }
}

export default function TagPage({ params }: TagPageProps) {
  const decodedTag = decodeURIComponent(params.tag)
  const posts = getBlogPostsByTag(decodedTag)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">#{decodedTag}</h1>
          <p className="text-gray-600 mb-8">
            {posts.length} post{posts.length !== 1 ? "s" : ""} tagged with "{decodedTag}"
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
