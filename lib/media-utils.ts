export interface MediaFile {
  id: string
  name: string
  type: "image" | "audio" | "video"
  url: string
  size: number
}

export function createMediaFile(file: File): Promise<MediaFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const mediaFile: MediaFile = {
        id: Date.now().toString(),
        name: file.name,
        type: getMediaType(file.type),
        url: reader.result as string,
        size: file.size,
      }
      resolve(mediaFile)
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function getMediaType(mimeType: string): "image" | "audio" | "video" {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("audio/")) return "audio"
  if (mimeType.startsWith("video/")) return "video"
  return "image" // fallback
}

export function isValidMediaFile(file: File): boolean {
  const validTypes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    // Audio
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    // Video
    "video/mp4",
    "video/webm",
    "video/ogg",
  ]

  return validTypes.includes(file.type) && file.size <= 50 * 1024 * 1024 // 50MB limit
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
