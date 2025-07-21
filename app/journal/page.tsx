import { getAllJournalPosts } from "@/lib/journal-data"
import { BlogPostCard } from "@/components/blog-post-card"
import { BlogHeader } from "@/components/blog-header"

export default async function BlogPage() {
  const posts = await getAllJournalPosts()

  return (
    <div className="min-h-screen bg-black text-white">
      <BlogHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Journal Entries</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  )
}
