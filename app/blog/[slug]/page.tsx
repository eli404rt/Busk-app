"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CommentSection } from "@/components/comment-section"
import { ArrowLeft, Calendar, Clock, Eye, Share2 } from "lucide-react"
import { getBlogPostBySlug, getCommentsByPostId } from "@/lib/blog-data"

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

  const comments = getCommentsByPostId(post.id)

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/blog">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
              {post.category}
            </Badge>
            {post.featured && <Badge className="bg-white text-black">Featured</Badge>}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>

          <p className="text-xl text-gray-300 mb-6">{post.excerpt}</p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formattedDate}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime} min read
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.views} views
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${tag}`}>
                <Badge variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800 cursor-pointer">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none mb-12 text-gray-300">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br>") }} />
        </div>

        <footer className="border-t border-gray-800 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Written by</p>
              <p className="font-semibold text-white">{post.author}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleShare}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share this post
            </Button>
          </div>
        </footer>

        <CommentSection postId={post.id} comments={comments} />
      </article>
    </div>
  )
}
