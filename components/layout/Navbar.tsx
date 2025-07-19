"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface UserInterface {
  _id: string
  email: string
  role: string
  profile: {
    firstName: string
    lastName: string
  }
}

export default function Navbar() {
  const [user, setUser] = useState<UserInterface | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchUser()
    updateCartCount()
    updateWishlistCount()

    // Listen for cart updates
    window.addEventListener("cartUpdated", updateCartCount)
    window.addEventListener("wishlistUpdated", updateWishlistCount)

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount)
      window.removeEventListener("wishlistUpdated", updateWishlistCount)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Failed to fetch user:", error)
    }
  }

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0))
  }

  const updateWishlistCount = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setWishlistCount(wishlist.length)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GE</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">GrowEasy</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-full"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-neutral-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-neutral-700 hover:text-primary-600 transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-neutral-700 hover:text-primary-600 transition-colors">
              Contact
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm" className="p-2">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative">
              <Button variant="ghost" size="sm" className="p-2">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="hidden lg:block">
                      {user.profile.firstName} {user.profile.lastName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  {user.role === "seller" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/seller/dashboard">Seller Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/products">My Products</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/shop">My Shop</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-full"
                />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                href="/products"
                className="block px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors"
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors"
              >
                Contact
              </Link>

              {user ? (
                <>
                  <div className="border-t border-neutral-200 pt-2 mt-2">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors"
                    >
                      My Orders
                    </Link>
                    {user.role === "seller" && (
                      <>
                        <Link
                          href="/seller/dashboard"
                          className="block px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors"
                        >
                          Seller Dashboard
                        </Link>
                        <Link
                          href="/seller/products"
                          className="block px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors"
                        >
                          My Products
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-neutral-200 pt-2 mt-2 space-y-2">
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
