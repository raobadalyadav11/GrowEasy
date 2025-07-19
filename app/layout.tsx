import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ECommerce Platform - Modern Multi-Vendor Marketplace",
  description:
    "A comprehensive e-commerce platform with affiliate marketing, seller management, and seamless payment processing.",
  keywords: "ecommerce, marketplace, affiliate marketing, online store, razorpay",
  authors: [{ name: "ECommerce Platform" }],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-neutral-50">{children}</div>
      </body>
    </html>
  )
}
