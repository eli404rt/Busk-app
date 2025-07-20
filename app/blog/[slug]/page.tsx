"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getBlogPostBySlug } from "@/lib/blog-data"

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

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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
            <span>{formattedDate}</span>
            <span>{post.readTime}m read</span>
          </div>

          <div className="flex gap-3 text-xs text-gray-600 mb-8">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${tag}`} className="hover:text-gray-400">
                #{tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-gray-300 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br>") }} />
        </div>
      </article>
    </div>
  )
}
