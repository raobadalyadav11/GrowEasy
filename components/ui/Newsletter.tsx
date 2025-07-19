"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface NewsletterProps {
  variant?: "default" | "compact" | "footer"
  className?: string
}

export function Newsletter({ variant = "default", className = "" }: NewsletterProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubscribed(true)
        setEmail("")
        toast.success(data.message)
      } else {
        toast.error(data.error || "Failed to subscribe")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === "compact") {
    return (
      <div className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          disabled={isSubmitting || isSubscribed}
        />
        <Button onClick={handleSubmit} disabled={isSubmitting || isSubscribed || !email} size="sm">
          {isSubscribed ? <CheckCircle className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    )
  }

  if (variant === "footer") {
    return (
      <div className={className}>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Mail className="h-5 w-5 mr-2" />
          Newsletter
        </h3>
        <p className="text-sm text-gray-600 mb-4">Subscribe to get updates on new products and exclusive offers.</p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={isSubmitting || isSubscribed}
          />
          <Button type="submit" disabled={isSubmitting || isSubscribed || !email} size="sm">
            {isSubmitting ? "..." : isSubscribed ? "✓" : "Subscribe"}
          </Button>
        </form>
        {isSubscribed && <p className="text-sm text-green-600 mt-2">Thank you for subscribing!</p>}
      </div>
    )
  }

  return (
    <Card className={`shadow-lg border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white ${className}`}>
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Mail className="h-8 w-8" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
        <p className="text-blue-100 mb-6">
          Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special offers.
        </p>

        {isSubscribed ? (
          <div className="flex items-center justify-center space-x-2 text-green-200">
            <CheckCircle className="h-5 w-5" />
            <span>Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
              disabled={isSubmitting}
              required
            />
            <Button type="submit" disabled={isSubmitting || !email} className="bg-white text-blue-600 hover:bg-blue-50">
              {isSubmitting ? (
                "Subscribing..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </form>
        )}

        <p className="text-xs text-blue-200 mt-4">We respect your privacy. Unsubscribe at any time.</p>
      </CardContent>
    </Card>
  )
}
