import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "MuxDay - Code Your Ideas Into Reality",
    template: "%s | MuxDay",
  },
  description:
    "A modern IDE for building and sharing static HTML, CSS, and JavaScript projects. Write code, preview instantly, and publish with one click.",
  generator: "v0.app",
  keywords: ["IDE", "code editor", "HTML", "CSS", "JavaScript", "web development", "CodePen alternative"],
  authors: [{ name: "MuxDay" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MuxDay",
    title: "MuxDay - Code Your Ideas Into Reality",
    description: "A modern IDE for building and sharing static HTML, CSS, and JavaScript projects.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MuxDay - Code Your Ideas Into Reality",
    description: "A modern IDE for building and sharing static HTML, CSS, and JavaScript projects.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#5865f2",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
