"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { isAuthenticated } from "@/lib/auth"
import {
  getAllJournalPosts,
  deleteJournalPost,
  updateJournalPost,
  refreshJournalData,
  type JournalPost,
} from "@/lib/journal-data"

export default function DashboardPage() {
  const [posts, setPosts] = useState<JournalPost[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const loadPosts = () => {
    console.log("Loading posts...")
    const fetchedPosts = getAllJournalPosts()
    console.log("Fetched posts:", fetchedPosts.length)
    setPosts(fetchedPosts)
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin")
      return
    }

    loadPosts()
    setLoading(false)

    // Listen for storage changes to update in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "journalPosts") {
        console.log("Storage changed, reloading posts...")
        loadPosts()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [router])

  const handleDelete = (id: string) => {
    const postToDelete = posts.find((p) => p.id === id)
    if (window.confirm(`Are you sure you want to delete "${postToDelete?.title}"?`)) {
      console.log("Deleting post:", id)
      deleteJournalPost(id)
      // Immediately update local state
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== id))
      console.log("Post deleted, refreshing list...")
    }
  }

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    console.log(`Toggling publish status for post ${id}: ${currentStatus} -> ${!currentStatus}`)
    const updatedPost = updateJournalPost(id, { published: !currentStatus })
    if (updatedPost) {
      // Immediately update local state
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === id ? { ...post, published: !currentStatus } : post)))
      console.log("Publish status updated")
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    console.log("Manual refresh triggered")
    const freshPosts = refreshJournalData()
    setPosts(freshPosts)
    setTimeout(() => setRefreshing(false), 500) // Small delay for UX
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Journal Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">{posts.length} total entries</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/admin/new-post">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Journal Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No journal entries found.</p>
                <Link href="/admin/new-post">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Entry
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(post.id, post.published)}>
                          {post.published ? (
                            <ToggleRight className="h-5 w-5 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-red-500" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>{post.featured ? "Yes" : "No"}</TableCell>
                      <TableCell>{post.views}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Link href={`/journal/${post.slug}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/edit-post/${post.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
