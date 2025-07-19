"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ShoppingCart, Heart, Share2, Star, Filter, Search } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatCurrency } from "@/lib/utils"

interface SellerShop {
  _id: string
  shopName: string
  shopDescription: string
  logo?: string
  banner?: string
  isActive: boolean
  customization: {
    primaryColor: string
    secondaryColor: string
    theme: "light" | "dark"
  }
  analytics: {
    totalVisits: number
    totalOrders: number
    totalRevenue: number
  }
}

interface Product {
  _id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  affiliatePercentage: number
  status: string
  featured: boolean
}

export default function ShopPage() {
  const params = useParams()
  const [shop, setShop] = useState<SellerShop | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (params.id) {
      fetchShop(params.id as string)
      fetchShopProducts(params.id as string)
    }
  }, [params.id])

  const fetchShop = async (shopId: string) => {
    try {
      const response = await fetch(`/api/shop/${shopId}`)
      if (response.ok) {
        const data = await response.json()
        setShop(data.shop)

        // Update visit count
        fetch(`/api/shop/${shopId}/visit`, { method: "POST" })
      }
    } catch (error) {
      console.error("Error fetching shop:", error)
    }
  }

  const fetchShopProducts = async (shopId: string) => {
    try {
      const response = await fetch(`/api/shop/${shopId}/products`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Error fetching shop products:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[productId] > 1) {
        newCart[productId]--
      } else {
        delete newCart[productId]
      }
      return newCart
    })
  }

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find((p) => p._id === productId)
      return total + (product ? product.price * quantity : 0)
    }, 0)
  }

  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty!")
      return
    }

    try {
      const orderItems = Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find((p) => p._id === productId)
        return {
          productId,
          quantity,
          price: product?.price || 0,
          name: product?.name || "",
        }
      })

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: shop?._id,
          items: orderItems,
          totalAmount: getCartTotal(),
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Initialize Razorpay payment
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: shop?.shopName || "Shop",
          description: "Purchase from " + shop?.shopName,
          order_id: data.order.id,
          handler: async (response: any) => {
            // Verify payment
            const verifyResponse = await fetch("/api/orders/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              }),
            })

            if (verifyResponse.ok) {
              setCart({})
              alert("Payment successful! Your order has been placed.")
            } else {
              alert("Payment verification failed!")
            }
          },
          prefill: {
            name: "Customer",
            email: "customer@example.com",
            contact: "9999999999",
          },
          theme: {
            color: shop?.customization.primaryColor || "#3B82F6",
          },
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      alert("Checkout failed!")
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "" || product.category === categoryFilter),
  )

  const categories = [...new Set(products.map((p) => p.category))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8" />
      </div>
    )
  }

  if (!shop || !shop.isActive) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Shop not available</h3>
        <p className="text-neutral-600">This shop is currently inactive or doesn't exist.</p>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={
        {
          "--primary-color": shop.customization.primaryColor,
          "--secondary-color": shop.customization.secondaryColor,
        } as React.CSSProperties
      }
    >
      {/* Add Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      {/* Shop Header */}
      <div className="relative">
        {shop.banner && (
          <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${shop.banner})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        )}
        <div className="relative bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-6">
              {shop.logo && (
                <img
                  src={shop.logo || "/placeholder.svg"}
                  alt={shop.shopName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{shop.shopName}</h1>
                <p className="text-neutral-600 mt-2">{shop.shopDescription}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-neutral-500">
                  <span>{shop.analytics.totalOrders} orders</span>
                  <span>•</span>
                  <span>{products.length} products</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>4.8 rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardBody>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Shopping Cart</h3>
                {Object.keys(cart).length === 0 ? (
                  <p className="text-neutral-600 text-sm">Your cart is empty</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(cart).map(([productId, quantity]) => {
                      const product = products.find((p) => p._id === productId)
                      if (!product) return null

                      return (
                        <div key={productId} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900 line-clamp-1">{product.name}</p>
                            <p className="text-sm text-neutral-600">
                              {formatCurrency(product.price)} × {quantity}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => removeFromCart(productId)}
                              className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-sm"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium">{quantity}</span>
                            <button
                              onClick={() => addToCart(productId)}
                              className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )
                    })}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-lg">{formatCurrency(getCartTotal())}</span>
                      </div>
                      <Button className="w-full" onClick={handleCheckout}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <Card className="mb-6">
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input">
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product._id} className="hover-lift">
                  <CardBody>
                    <div className="relative mb-4">
                      <img
                        src={product.images[0] || "/placeholder.svg?height=200&width=300"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {product.featured && (
                        <Badge variant="warning" className="absolute top-2 left-2">
                          Featured
                        </Badge>
                      )}
                      <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-neutral-50">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary-600">{formatCurrency(product.price)}</span>
                        {product.comparePrice && (
                          <span className="text-sm text-neutral-500 line-through">
                            {formatCurrency(product.comparePrice)}
                          </span>
                        )}
                      </div>
                      <Badge variant="success">{product.category}</Badge>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => addToCart(product._id)}
                        style={{ backgroundColor: shop.customization.primaryColor }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
