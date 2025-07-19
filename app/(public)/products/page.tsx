"use client"

import { useState, useEffect } from "react"
import { Search, Grid, List, Star, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  seller: {
    _id: string
    businessName: string
    rating: number
  }
  rating: number
  reviewCount: number
  inStock: boolean
  featured: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (priceRange !== "all") params.append("priceRange", priceRange)
      if (sortBy !== "newest") params.append("sortBy", sortBy)

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item._id === product._id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    // Trigger cart update event
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const addToWishlist = (productId: string) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    if (!wishlist.includes(productId)) {
      wishlist.push(productId)
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && <Badge className="absolute top-2 left-2 bg-primary-600">Featured</Badge>}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" variant="secondary" onClick={() => addToWishlist(product._id)} className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <Link href={`/products/${product._id}`}>
            <h3 className="font-semibold text-neutral-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-neutral-600 ml-2">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-neutral-900">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {product.originalPrice && (
              <Badge variant="secondary" className="text-green-600">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          <div className="text-sm text-neutral-600 mb-3">
            by{" "}
            <Link href={`/sellers/${product.seller._id}`} className="text-primary-600 hover:underline">
              {product.seller.businessName}
            </Link>
          </div>

          <Button onClick={() => addToCart(product)} disabled={!product.inStock} className="w-full" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            {product.featured && <Badge className="absolute top-2 left-2 bg-primary-600">Featured</Badge>}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <Link href={`/products/${product._id}`}>
                <h3 className="text-xl font-semibold text-neutral-900 hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <Button size="sm" variant="outline" onClick={() => addToWishlist(product._id)}>
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-neutral-600 mb-3 line-clamp-3">{product.description}</p>

            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-600 ml-2">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-neutral-900">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-neutral-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <Badge variant="secondary" className="text-green-600">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-sm text-neutral-600">
                  by{" "}
                  <Link href={`/sellers/${product.seller._id}`} className="text-primary-600 hover:underline">
                    {product.seller.businessName}
                  </Link>
                </div>
                <Button onClick={() => addToCart(product)} disabled={!product.inStock} size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">All Products</h1>
          <p className="text-neutral-600">Discover amazing products from verified sellers</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-500">Under ₹500</SelectItem>
                <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                <SelectItem value="10000+">Above ₹10,000</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-neutral-600">{products.length} products found</div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-neutral-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-neutral-200 rounded"></div>
                    <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"
            }
          >
            {products.map((product) =>
              viewMode === "grid" ? (
                <ProductCard key={product._id} product={product} />
              ) : (
                <ProductListItem key={product._id} product={product} />
              ),
            )}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No products found</h3>
            <p className="text-neutral-600">Try adjusting your search criteria or browse all categories</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
