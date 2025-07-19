import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Eli's Art & Life - A Journey Through Creativity",
  description: "Exploring the intersection of art, life, and love through philosophy, music, and creative expression.",
  keywords: ["art", "philosophy", "music", "creativity", "blog", "life"],
  authors: [{ name: "Eli Cadieux" }],
  openGraph: {
    title: "Eli's Art & Life",
    description: "A journey through creativity and philosophical expression",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
