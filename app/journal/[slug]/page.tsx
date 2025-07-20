"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Instagram } from "lucide-react"
import { getBlogPostBySlug } from "@/lib/blog-data"
import { TipButton } from "@/components/tip-button"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderMarkdown = (markdown: string) => {
    const html = markdown
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-200">$1</code>')
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/gim,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white underline">$1</a>',
      )
      .replace(/^- (.*$)/gim, '<li class="ml-4 text-gray-300">$1</li>')
      .replace(/\n/gim, "<br>")

    return html
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/blog">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-8 -ml-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              back
            </Button>
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 pb-16">
        <header className="mb-12">
          <h1 className="text-2xl md:text-3xl font-medium text-white mb-4 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-6 text-sm text-gray-500 font-mono mb-8">
            <span>{formatTimestamp(post.publishedAt)}</span>
            <span>{post.views} views</span>
          </div>

          <div className="flex gap-3 text-xs text-gray-600 mb-8">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${tag}`} className="hover:text-gray-400">
                #{tag}
              </Link>
            ))}
          </div>
        </header>

        {/* Media Files */}
        {post.mediaFiles && post.mediaFiles.length > 0 && (
          <div className="mb-12 space-y-6">
            {post.mediaFiles.map((media) => (
              <div key={media.id} className="rounded-lg overflow-hidden">
                {media.type === "image" && (
                  <img
                    src={
                      media.url ||
                      "/placeholder.svg?height=400&width=800&text=Article+Outline:+Introduction+•+Main+Points+•+Supporting+Evidence+•+Conclusion"
                    }
                    alt={media.name}
                    className="w-full max-h-96 object-cover"
                  />
                )}
                {media.type === "audio" && (
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm mb-2">{media.name}</p>
                    <audio controls className="w-full">
                      <source src={media.url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                {media.type === "video" && (
                  <video controls className="w-full max-h-96">
                    <source src={media.url} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-300 leading-relaxed mb-12">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
        </div>

        {/* Tip Button */}
        <div className="flex justify-center mb-12">
          <TipButton />
        </div>

        {/* Footer with links */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Written by</p>
              <p className="font-semibold text-white">{post.author}</p>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                onClick={() => window.open("https://instagram.com/eli_cadieux", "_blank")}
              >
                <Instagram className="h-4 w-4 mr-2" />
                @eli_cadieux
              </Button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}
