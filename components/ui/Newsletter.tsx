"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Check } from "lucide-react"
import Button from "./Button"
import Input from "./Input"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubscribed(true)
        setEmail("")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to subscribe")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      alert("Failed to subscribe")
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Successfully Subscribed!</h3>
        <p className="text-primary-100">
          Thank you for subscribing to our newsletter. You'll receive updates about new products, offers, and more.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Stay Updated</h3>
        <p className="text-primary-100">
          Subscribe to our newsletter and get the latest updates on new products, exclusive offers, and platform news.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white border-0"
          />
        </div>
        <Button type="submit" loading={loading} className="bg-white text-primary-600 hover:bg-primary-50 border-0 whit">
          Subscribe
        </Button>
      </form>

      <p className="text-xs text-primary-200 mt-3 text-center">
        By subscribing, you agree to our Privacy Policy and Terms of Service.
      </p>
    </div>
  )
}
