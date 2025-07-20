"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Loader2 } from "lucide-react" // Added Loader2 import
import Link from "next/link"
import { isAuthenticated } from "@/lib/auth"
import { getAllJournalPosts, deleteJournalPost, updateJournalPost, type JournalPost } from "@/lib/journal-data" // Updated imports

export default function DashboardPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]) // Updated interface
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin")
      return
    }
    const fetchedPosts = getAllJournalPosts() // Updated function call
    setPosts(fetchedPosts)
    setLoading(false)
  }, [router])

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      // Updated text
      deleteJournalPost(id) // Updated function call
      setPosts(getAllJournalPosts()) // Refresh posts // Updated function call
    }
  }

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    const updatedPost = updateJournalPost(id, { published: !currentStatus }) // Updated function call
    if (updatedPost) {
      setPosts(getAllJournalPosts()) // Refresh posts // Updated function call
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Journal Dashboard</h1> {/* Updated text */}
          <Link href="/admin/new-post">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Entry {/* Updated text */}
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Journal Entries</CardTitle> {/* Updated text */}
          </CardHeader>
          <CardContent>
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
                        {" "}
                        {/* Updated link */}
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
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
