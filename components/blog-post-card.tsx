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
    <Card className={`hover:shadow-lg transition-shadow duration-300 ${featured ? "border-2 border-blue-200" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{post.category}</Badge>
          {featured && <Badge variant="default">Featured</Badge>}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2 className={`font-bold hover:text-blue-600 transition-colors ${featured ? "text-2xl" : "text-xl"}`}>
            {post.title}
          </h2>
        </Link>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
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
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/blog/tag/${tag}`}>
              <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                #{tag}
              </Badge>
            </Link>
          ))}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <span className="text-blue-600 hover:text-blue-800 font-medium">Read more →</span>
        </Link>
      </CardContent>
    </Card>
  )
}
