import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye } from "lucide-react"
import type { BlogPost } from "@/lib/blog-data"

interface BlogPostCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card
      className={`bg-gray-900 border-gray-800 hover:border-gray-600 transition-all duration-300 ${featured ? "border-2 border-gray-600" : ""}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
            {post.category}
          </Badge>
          {featured && <Badge className="bg-white text-black">Featured</Badge>}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2
            className={`font-bold text-white hover:text-gray-300 transition-colors ${featured ? "text-2xl" : "text-xl"}`}
          >
            {post.title}
          </h2>
        </Link>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
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
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/blog/tag/${tag}`}>
              <Badge variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800 cursor-pointer">
                #{tag}
              </Badge>
            </Link>
          ))}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <span className="text-gray-300 hover:text-white font-medium">Read more →</span>
        </Link>
      </CardContent>
    </Card>
  )
}
