"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Loader2 } from "lucide-react" // Added Loader2 import
import Link from "next/link"
import { isAuthenticated } from "@/lib/auth"
import { getJournalPostById, updateJournalPost } from "@/lib/journal-data" // Updated imports
import { MediaUploader } from "@/components/media-uploader"
import { MarkdownEditor } from "@/components/markdown-editor"
import type { MediaFile } from "@/lib/media-utils"
import type { JournalPost } from "@/lib/journal-data" // Updated import

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [formData, setFormData] = useState<Omit<JournalPost, "id" | "publishedAt" | "updatedAt" | "views"> | null>(null) // Updated interface
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin")
      return
    }

    const post = getJournalPostById(id) // Updated function call
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        tags: post.tags.join(", "),
        category: post.category,
        featured: post.featured,
        published: post.published,
      })
      setMediaFiles(post.mediaFiles || [])
    } else {
      // Handle case where post is not found, maybe redirect to a 404 or dashboard
      router.push("/admin/dashboard")
    }
    setLoading(false)
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData) return

    const slug =
      formData.slug ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const updatedPostData = {
      // Renamed variable
      ...formData,
      slug,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      mediaFiles,
    }

    try {
      updateJournalPost(id, updatedPostData) // Updated function call
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error updating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : null))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => (prev ? { ...prev, content } : null))
  }

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => (prev ? { ...prev, [name]: checked } : null))
  }

  const handleMediaAdd = (media: MediaFile) => {
    setMediaFiles((prev) => [...prev, media])
  }

  const handleMediaRemove = (mediaId: string) => {
    setMediaFiles((prev) => prev.filter((media) => media.id !== mediaId))
  }

  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Journal Entry</h1> {/* Updated text */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Journal Entry</CardTitle> {/* Updated text */}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (optional)</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="auto-generated from title"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief description of the post"
                  required
                />
              </div>

              <div>
                <Label>Content (Markdown)</Label>
                <MarkdownEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your post content in Markdown..."
                />
              </div>

              <div>
                <Label>Media Files</Label>
                <MediaUploader onMediaAdd={handleMediaAdd} onMediaRemove={handleMediaRemove} mediaFiles={mediaFiles} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Philosophy, Music, Technology"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., art, creativity, life"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={handleSwitchChange("featured")}
                    />
                    <Label htmlFor="featured">Featured Entry</Label> {/* Updated text */}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={handleSwitchChange("published")}
                    />
                    <Label htmlFor="published">Publish Immediately</Label>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Updating..." : "Update Entry"} {/* Updated text */}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
