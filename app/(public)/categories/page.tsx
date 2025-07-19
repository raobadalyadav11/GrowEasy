"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Link from "next/link"

interface Category {
  _id: string
  name: string
  description: string
  image: string
  productCount: number
  featured: boolean
  subcategories?: string[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const featuredCategories = categories.filter((cat) => cat.featured)
  const regularCategories = categories.filter((cat) => !cat.featured)

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Shop by Category</h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Explore our wide range of product categories and find exactly what you're looking for
          </p>
        </div>

        {/* Featured Categories */}
        {featuredCategories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Featured Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCategories.map((category) => (
                <Card
                  key={category._id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={category.image || "/placeholder.jpg"}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <Badge className="absolute top-4 left-4 bg-primary-600">Featured</Badge>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                        <p className="text-sm opacity-90">{category.productCount} products</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-neutral-600 mb-4 line-clamp-2">{category.description}</p>
                      <Link href={`/products?category=${category.name}`}>
                        <Button className="w-full group">
                          Shop Now
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Categories */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">All Categories</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-32 bg-neutral-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-neutral-200 rounded"></div>
                      <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularCategories.map((category) => (
                <Card
                  key={category._id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={category.image || "/placeholder.jpg"}
                        alt={category.name}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 text-white">
                        <div className="text-xs opacity-90">{category.productCount} products</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{category.description}</p>
                      <Link href={`/products?category=${category.name}`}>
                        <Button variant="outline" size="sm" className="w-full group bg-transparent">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Browse
                          <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {!loading && categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <ShoppingBag className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No categories found</h3>
            <p className="text-neutral-600">Categories will appear here once they are added by administrators</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
