import Link from "next/link"
import type { BlogPost } from "@/lib/blog-data"

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="py-6 border-b border-gray-900 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-white hover:text-gray-300 transition-colors text-lg font-medium">{post.title}</h2>
        </Link>
        <span className="text-gray-500 text-sm font-mono ml-4 flex-shrink-0">{formattedDate}</span>
      </div>

      <p className="text-gray-400 text-sm mb-3 leading-relaxed">{post.excerpt}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs text-gray-600">
          {post.tags.slice(0, 2).map((tag) => (
            <Link key={tag} href={`/blog/tag/${tag}`} className="hover:text-gray-400">
              #{tag}
            </Link>
          ))}
        </div>
        <span className="text-xs text-gray-600 font-mono">{post.readTime}m</span>
      </div>
    </div>
  )
}
