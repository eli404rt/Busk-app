"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, ImageIcon, Music, Video, File } from "lucide-react"
import { createMediaFile, isValidMediaFile, formatFileSize, type MediaFile } from "@/lib/media-utils"

interface MediaUploaderProps {
  onMediaAdd: (media: MediaFile) => void
  onMediaRemove: (mediaId: string) => void
  mediaFiles: MediaFile[]
}

export function MediaUploader({ onMediaAdd, onMediaRemove, mediaFiles }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    setIsUploading(true)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!isValidMediaFile(file)) {
        alert(`Invalid file: ${file.name}. Please upload images, audio (MP3), or video files under 50MB.`)
        continue
      }

      try {
        const mediaFile = await createMediaFile(file)
        onMediaAdd(mediaFile)
      } catch (error) {
        console.error("Error processing file:", error)
        alert(`Error processing ${file.name}`)
      }
    }

    setIsUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const getMediaIcon = (type: MediaFile["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop media files here, or{" "}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={() => fileInputRef.current?.click()}
          >
            browse
          </button>
        </p>
        <p className="text-sm text-gray-500">Supports images, audio (MP3), and video files up to 50MB</p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,video/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {isUploading && <div className="text-center text-gray-600">Processing files...</div>}

      {mediaFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Media</h4>
          <div className="grid gap-2">
            {mediaFiles.map((media) => (
              <Card key={media.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getMediaIcon(media.type)}
                    <div>
                      <p className="font-medium text-sm">{media.name}</p>
                      <p className="text-xs text-gray-500">
                        {media.type} • {formatFileSize(media.size)}
                      </p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => onMediaRemove(media.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Preview */}
                <div className="mt-3">
                  {media.type === "image" && (
                    <img
                      src={media.url || "/placeholder.svg"}
                      alt={media.name}
                      className="max-w-full h-32 object-cover rounded"
                    />
                  )}
                  {media.type === "audio" && (
                    <audio controls className="w-full">
                      <source src={media.url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {media.type === "video" && (
                    <video controls className="w-full max-h-48">
                      <source src={media.url} type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
