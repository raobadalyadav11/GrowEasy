"use client"

import type React from "react"

import Link from "next/link"
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmail("")
        alert("Successfully subscribed to newsletter!")
      } else {
        alert("Failed to subscribe. Please try again.")
      }
    } catch (error) {
      alert("Failed to subscribe. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  const footerLinks = {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/our-story" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
    sellers: [
      { label: "Become a Seller", href: "/seller/application" },
      { label: "Seller Dashboard", href: "/seller/dashboard" },
      { label: "Seller Guidelines", href: "/seller-guidelines" },
      { label: "Commission Structure", href: "/commission" },
      { label: "Seller Support", href: "/seller-support" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  }

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Our Latest Offers</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get exclusive deals, new product announcements, and insider tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white text-neutral-900 border-0"
              />
              <Button type="submit" disabled={isSubscribing} className="bg-white text-primary-600 hover:bg-neutral-100">
                {isSubscribing ? "..." : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">GrowEasy</span>
              </Link>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Empowering businesses to grow online with cutting-edge e-commerce solutions. Join thousands of
                successful sellers and start building your online empire today.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-primary-400" />
                  <span className="text-neutral-400">support@groweasy.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-primary-400" />
                  <span className="text-neutral-400">+91 9876543210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-primary-400" />
                  <span className="text-neutral-400">Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-neutral-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-neutral-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sellers Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">For Sellers</h4>
              <ul className="space-y-3">
                {footerLinks.sellers.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-neutral-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-neutral-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media & Bottom Bar */}
          <div className="border-t border-neutral-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-4 md:mb-0">
                <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
              <p className="text-neutral-400 text-sm">&copy; 2024 GrowEasy. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
