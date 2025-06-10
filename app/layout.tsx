import type React from "react"
import "./globals.css"
import "./noise.css"
import type { Metadata } from "next"
import { ModelProvider } from "@/contexts/model-context"

export const metadata: Metadata = {
  title: "Meta4Model - Multi-Framework Modeling Tool",
  description: "Create diagrams using various modeling frameworks like KAOS and i*",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="funnel-display-base">
        <ModelProvider>{children}</ModelProvider>
      </body>
    </html>
  )
}
