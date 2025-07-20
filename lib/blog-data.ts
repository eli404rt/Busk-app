import type { MediaFile } from "./media-utils"

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  category: string
  featured: boolean
  published: boolean
  views: number
  mediaFiles?: MediaFile[]
}

export interface Comment {
  id: string
  postId: string
  author: string
  email: string
  content: string
  createdAt: string
  approved: boolean
}

// Default blog posts data
const defaultBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Philosophy of Art and Life",
    slug: "philosophy-of-art-and-life",
    excerpt: "Exploring the deep connection between artistic expression and the meaning of existence.",
    content: `# The Philosophy of Art and Life

Art is not merely decoration or entertainment—it is the very essence of human expression and understanding. When we create, we touch something divine within ourselves.

## The Creative Process

The act of creation is both deeply personal and universally human. It connects us to:

- Our innermost thoughts and feelings
- The collective human experience
- The divine spark of creativity
- The eternal quest for meaning

## Art as Life's Purpose

Perhaps the greatest tragedy is not pursuing one's artistic calling. As the saying goes, "pity you didn't dedicate your life to Art"—for in art, we find not just expression, but purpose itself.

The equation LIFE⁴ (ART) = ¹LOVE suggests that life raised to the fourth power through art equals pure love. This mathematical poetry captures the transformative power of creative expression.

## Conclusion

Every moment we don't create is a moment we're not fully alive. Art isn't just what we do—it's who we are.`,
    author: "Eli Cadieux",
    publishedAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    tags: ["philosophy", "art", "creativity"],
    category: "Philosophy",
    featured: true,
    published: true,
    views: 1247,
    mediaFiles: [],
  },
  {
    id: "2",
    title: "Music as the Universal Language",
    slug: "music-universal-language",
    excerpt: "How music transcends barriers and connects souls across cultures and time.",
    content: `# Music as the Universal Language

Music speaks where words fail. It's the one language that every human heart understands, regardless of culture, age, or background.

## The Power of Melody

A simple melody can:
- Evoke memories from decades past
- Bring strangers together in harmony
- Express emotions too complex for words
- Heal wounds that time cannot touch

## Rhythm of Life

Every heartbeat is a drum, every breath a note. We are all musicians in the grand symphony of existence.

## Request a Song

Music is meant to be shared. If there's a song that speaks to your soul, don't hesitate to request it. Let's create a playlist of human experience together.`,
    author: "Eli Cadieux",
    publishedAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    tags: ["music", "culture", "connection"],
    category: "Music",
    featured: false,
    published: true,
    views: 892,
    mediaFiles: [],
  },
  {
    id: "3",
    title: "The Digital Canvas: Art in the Modern Age",
    slug: "digital-canvas-modern-art",
    excerpt: "Exploring how technology has transformed artistic expression and creativity.",
    content: `# The Digital Canvas: Art in the Modern Age

The digital revolution has not killed traditional art—it has expanded its possibilities infinitely.

## New Mediums, Timeless Expression

Digital tools offer artists:
- Unlimited colors and textures
- The ability to undo and iterate
- Global reach and instant sharing
- Collaborative possibilities

## The Instagram Generation

Social media platforms like Instagram have democratized art sharing. Every post is a potential masterpiece, every story a canvas for creativity.

## Preserving the Human Touch

Despite technological advances, the most powerful art still comes from the human heart. Technology is just the brush—the artist's soul is still the paint.`,
    author: "Eli Cadieux",
    publishedAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
    tags: ["digital art", "technology", "social media"],
    category: "Technology",
    featured: false,
    published: true,
    views: 654,
    mediaFiles: [],
  },
]

// Use localStorage for persistence with fallback
function getBlogPostsFromStorage(): BlogPost[] {
  if (typeof window === "undefined") return defaultBlogPosts
  const stored = localStorage.getItem("blogPosts")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultBlogPosts
    }
  }
  // Initialize localStorage with default posts
  localStorage.setItem("blogPosts", JSON.stringify(defaultBlogPosts))
  return defaultBlogPosts
}

function saveBlogPostsToStorage(posts: BlogPost[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("blogPosts", JSON.stringify(posts))
}

// Export the blogPosts array as required
export const blogPosts = typeof window !== "undefined" ? getBlogPostsFromStorage() : defaultBlogPosts

export const comments: Comment[] = [
  {
    id: "1",
    postId: "1",
    author: "Sarah Johnson",
    email: "sarah@example.com",
    content: "This really resonates with me. I've been struggling with whether to pursue my art full-time.",
    createdAt: "2024-01-16T08:30:00Z",
    approved: true,
  },
  {
    id: "2",
    postId: "1",
    author: "Mike Chen",
    email: "mike@example.com",
    content: "Beautiful perspective on the relationship between art and life. Thank you for sharing.",
    createdAt: "2024-01-16T12:45:00Z",
    approved: true,
  },
]

// Helper functions
export function getBlogPosts(): BlogPost[] {
  return getBlogPostsFromStorage().filter((post) => post.published)
}

export function getAllBlogPosts(): BlogPost[] {
  return getBlogPostsFromStorage()
}

export function getFeaturedPosts(): BlogPost[] {
  return getBlogPostsFromStorage().filter((post) => post.published && post.featured)
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPostsFromStorage().find((post) => post.slug === slug && post.published)
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return getBlogPostsFromStorage().find((post) => post.id === id)
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return getBlogPostsFromStorage().filter((post) => post.published && post.category === category)
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return getBlogPostsFromStorage().filter((post) => post.published && post.tags.includes(tag))
}

export function searchBlogPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase()
  return getBlogPostsFromStorage().filter(
    (post) =>
      post.published &&
      (post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))),
  )
}

export function getCommentsByPostId(postId: string): Comment[] {
  return comments.filter((comment) => comment.postId === postId && comment.approved)
}

export function getAllCategories(): string[] {
  const categories = getBlogPostsFromStorage().map((post) => post.category)
  return [...new Set(categories)]
}

export function getAllTags(): string[] {
  const tags = getBlogPostsFromStorage().flatMap((post) => post.tags)
  return [...new Set(tags)]
}

export function addBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "views">): BlogPost {
  const posts = getBlogPostsFromStorage()
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
  }
  posts.unshift(newPost)
  saveBlogPostsToStorage(posts)
  return newPost
}

export function updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
  const posts = getBlogPostsFromStorage()
  const index = posts.findIndex((post) => post.id === id)
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates, updatedAt: new Date().toISOString() }
    saveBlogPostsToStorage(posts)
    return posts[index]
  }
  return null
}

export function deleteBlogPost(id: string): void {
  const posts = getBlogPostsFromStorage()
  const filtered = posts.filter((post) => post.id !== id)
  saveBlogPostsToStorage(filtered)
}
