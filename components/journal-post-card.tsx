import Link from "next/link"
import type { JournalPost } from "@/lib/journal-data"

interface JournalPostCardProps {
  post: JournalPost
}

export function JournalPostCard({ post }: JournalPostCardProps) {
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Link
      href={`/journal/${post.slug}`}
      className="block p-6 bg-black rounded-lg shadow hover:bg-gray-900 transition-colors mb-4"
    >
      <article>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
          <time className="text-sm text-gray-400">{formatTimestamp(post.date)}</time>
        </div>
        <p className="text-gray-300 mb-4">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  )
}
