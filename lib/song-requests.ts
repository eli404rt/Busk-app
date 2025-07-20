export interface SongRequest {
  id: string
  name: string
  email: string
  songTitle: string
  artist: string
  message?: string
  createdAt: string
  status: "pending" | "approved" | "completed"
}

// Use localStorage for persistence
function getSongRequestsFromStorage(): SongRequest[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("songRequests")
  if (stored) {
    return JSON.parse(stored)
  }
  return [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      songTitle: "Bohemian Rhapsody",
      artist: "Queen",
      message: "This song always reminds me of my late father. Would love to hear your interpretation.",
      createdAt: "2024-01-18T14:30:00Z",
      status: "pending",
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@example.com",
      songTitle: "Hallelujah",
      artist: "Leonard Cohen",
      message: "Such a beautiful and haunting song. Perfect for your style.",
      createdAt: "2024-01-17T09:15:00Z",
      status: "approved",
    },
    {
      id: "3",
      name: "Emma Wilson",
      email: "emma@example.com",
      songTitle: "The Sound of Silence",
      artist: "Simon & Garfunkel",
      message: "",
      createdAt: "2024-01-16T16:45:00Z",
      status: "completed",
    },
  ]
}

function saveSongRequestsToStorage(requests: SongRequest[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("songRequests", JSON.stringify(requests))
}

export function getSongRequests(): SongRequest[] {
  return getSongRequestsFromStorage().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getSongRequestsByStatus(status: SongRequest["status"]): SongRequest[] {
  return getSongRequestsFromStorage().filter((request) => request.status === status)
}

export function addSongRequest(request: Omit<SongRequest, "id" | "createdAt" | "status">): SongRequest {
  const requests = getSongRequestsFromStorage()
  const newRequest: SongRequest = {
    ...request,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: "pending",
  }
  requests.unshift(newRequest)
  saveSongRequestsToStorage(requests)
  return newRequest
}

export function updateSongRequestStatus(id: string, status: SongRequest["status"]): void {
  const requests = getSongRequestsFromStorage()
  const index = requests.findIndex((req) => req.id === id)
  if (index !== -1) {
    requests[index].status = status
    saveSongRequestsToStorage(requests)
  }
}

export function deleteSongRequest(id: string): void {
  const requests = getSongRequestsFromStorage()
  const filtered = requests.filter((req) => req.id !== id)
  saveSongRequestsToStorage(filtered)
}
