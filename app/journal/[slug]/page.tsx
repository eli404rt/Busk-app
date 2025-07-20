import { getJournalPostBySlug, getCommentsByPostId } from "@/lib/journal-data" // Updated imports
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { CommentSection } from "@/components/comment-section"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getJournalPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const comments = getCommentsByPostId(post.id)

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/journal">
            <a className="text-gray-400 hover:text-white flex items-center">
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Journal
            </a>
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="prose prose-invert lg:prose-xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <p className="text-gray-400 text-sm mb-4">
            By {post.author} on {format(new Date(post.publishedAt), "MMMM dd, yyyy")}
          </p>
          <div className="mb-6">
            {post.mediaFiles && post.mediaFiles.length > 0 && (
              <img
                src={post.mediaFiles[0].url}
                alt={post.title}
                className="w-full h-auto rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/1200x600/000000/FFFFFF?text=Image+Unavailable";
                  e.currentTarget.onerror = null;
                }}
              />
            )}
          </div>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Categories & Tags</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
        <CommentSection postId={post.id} comments={comments} />
      </main>
    </div>
  )
}
