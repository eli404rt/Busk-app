import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "agent404",
  description: "A personal blog and portfolio exploring art, philosophy, music, and creativity.",
  keywords: ["art", "philosophy", "music", "creativity", "life", "blog", "portfolio"],
  authors: [{ name: "agent404" }],
  openGraph: {
    title: "agent404",
    description: "A personal blog and portfolio exploring art, philosophy, music, and creativity.",
    type: "website",
  },
    generator: 'Next.js'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
      </body>
    </html>
  )
}
