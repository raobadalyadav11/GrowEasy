"use client"

import { useEffect, useState } from "react"
import { Star, MapPin, Phone, Mail, Globe, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

interface Shop {
  _id: string
  businessName: string
  description: string
  logo?: string
  banner?: string
  address: {
    city: string
    state: string
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  rating: number
  totalReviews: number
  isActive: boolean
}

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  affiliatePercentage: number
  inStock: boolean
}

export default function PublicShopPage({ params }: { params: { id: string } }) {
  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchShop()
    fetchProducts()
  }, [params.id])

  const fetchShop = async () => {
    try {
      const response = await fetch(`/api/shop/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setShop(data.shop)
      } else {
        setError("Shop not found")
      }
    } catch (error) {
      console.error("Error fetching shop:", error)
      setError("Failed to load shop")
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/shop/${params.id}/products`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const trackVisit = async () => {
    try {
      await fetch(`/api/shop/${params.id}/visit`, {
        method: "POST",
      })
    } catch (error) {
      console.error("Error tracking visit:", error)
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
    window.dispatchEvent(new Event("cartUpdated"))
    alert("Product added to cart!")
  }

  const addToWishlist = (productId: string) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    if (!wishlist.includes(productId)) {
      wishlist.push(productId)
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
      window.dispatchEvent(new Event("wishlistUpdated"))
      alert("Product added to wishlist!")
    }
  }

  useEffect(() => {
    if (shop) {
      trackVisit()
    }
  }, [shop])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-48 bg-neutral-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-neutral-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">{error || "Shop not found"}</h3>
            <p className="text-neutral-600 mb-4">The shop you're looking for doesn't exist or is not available.</p>
            <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shop Header */}
        <div className="relative mb-8">
          <div
            className="h-48 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center"
            style={{
              backgroundImage: shop.banner ? `url(${shop.banner})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!shop.banner && (
              <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-2">{shop.businessName}</h1>
                <p className="text-primary-100">Quality Products • Trusted Seller</p>
              </div>
            )}
          </div>

          <div className="absolute -bottom-6 left-6 flex items-end space-x-4">
            <div className="w-24 h-24 bg-white rounded-lg border-4 border-white shadow-lg flex items-center justify-center">
              {shop.logo ? (
                <img
                  src={shop.logo || "/placeholder.svg"}
                  alt={shop.businessName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-2xl font-bold text-primary-600">{shop.businessName.charAt(0)}</div>
              )}
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-white mb-1">{shop.businessName}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(shop.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white text-sm">({shop.totalReviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Info */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About {shop.businessName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 mb-4">{shop.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    <span>
                      {shop.address.city}, {shop.address.state}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-neutral-400" />
                    <span>{shop.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-neutral-400" />
                    <span>{shop.contact.email}</span>
                  </div>
                  {shop.contact.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-neutral-400" />
                      <a
                        href={shop.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shop Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Products</span>
                    <span className="font-semibold">{products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{shop.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Reviews</span>
                    <span className="font-semibold">{shop.totalReviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shop Status</span>
                    <Badge variant={shop.isActive ? "success" : "secondary"}>
                      {shop.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Products */}
        <Card>
          <CardHeader>
            <CardTitle>Products from {shop.businessName}</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-600">No products available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card
                    key={product._id}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.images[0] || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => addToWishlist(product._id)}
                            className="h-8 w-8 p-0"
                          >
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
                        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{product.description}</p>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-neutral-900">{formatCurrency(product.price)}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-neutral-500 line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {product.originalPrice && (
                            <Badge variant="secondary" className="text-green-600">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline">{product.category}</Badge>
                          <span className="text-xs text-neutral-500">{product.affiliatePercentage}% commission</span>
                        </div>

                        <Button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="w-full"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
