import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GrowEasy - Modern Multi-Vendor E-commerce Platform",
  description:
    "Join India's fastest-growing e-commerce platform. Start selling today with zero setup fees, powerful tools, and dedicated support to grow your business.",
  keywords: "ecommerce, marketplace, affiliate marketing, online store, razorpay, india, sellers, products",
  authors: [{ name: "GrowEasy Platform" }],
  generator: "v0.dev",
  openGraph: {
    title: "GrowEasy - Modern Multi-Vendor E-commerce Platform",
    description: "Join India's fastest-growing e-commerce platform. Start selling today with zero setup fees.",
    url: "https://groweasy.com",
    siteName: "GrowEasy",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "GrowEasy Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowEasy - Modern Multi-Vendor E-commerce Platform",
    description: "Join India's fastest-growing e-commerce platform. Start selling today with zero setup fees.",
    images: ["/placeholder-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/placeholder-logo.svg" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-neutral-50">{children}</div>
      </body>
    </html>
  )
}
