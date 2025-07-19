"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Copy, Eye, TrendingUp, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  affiliatePercentage: number
  status: string
  stock: number
  createdAt: string
}

interface AffiliateLink {
  _id: string
  affiliateCode: string
  productId: Product
  clicks: number
  conversions: number
  earnings: number
  createdAt: string
}

interface ShopStats {
  totalProducts: number
  totalClicks: number
  totalEarnings: number
  conversionRate: number
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([])
  const [shopStats, setShopStats] = useState<ShopStats>({
    totalProducts: 0,
    totalClicks: 0,
    totalEarnings: 0,
    conversionRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchAffiliateLinks()
    fetchShopStats()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/seller/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchAffiliateLinks = async () => {
    try {
      const response = await fetch("/api/seller/affiliate-links")
      if (response.ok) {
        const data = await response.json()
        setAffiliateLinks(data.links || [])
      }
    } catch (error) {
      console.error("Error fetching affiliate links:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchShopStats = async () => {
    try {
      const response = await fetch("/api/seller/shop/stats")
      if (response.ok) {
        const data = await response.json()
        setShopStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching shop stats:", error)
    }
  }

  const generateAffiliateLink = async (productId: string) => {
    try {
      const response = await fetch("/api/seller/affiliate-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        fetchAffiliateLinks()
        alert("Affiliate link generated successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to generate affiliate link")
      }
    } catch (error) {
      console.error("Error generating affiliate link:", error)
      alert("Failed to generate affiliate link")
    }
  }

  const copyAffiliateLink = (affiliateCode: string) => {
    const link = `${window.location.origin}/shop/product/${affiliateCode}`
    navigator.clipboard.writeText(link)
    alert("Affiliate link copied to clipboard!")
  }

  const viewShopPage = () => {
    window.open("/seller/shop", "_blank")
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getAffiliateLink = (productId: string) => {
    return affiliateLinks.find((link) => link.productId._id === productId)
  }

  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Products</h1>
          <p className="text-neutral-600 mt-2">Manage your approved products and affiliate links</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setIsStatsDialogOpen(true)}>
            <TrendingUp className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button onClick={viewShopPage}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View My Shop
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Active Products</p>
                <p className="text-2xl font-bold text-neutral-900">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <ExternalLink className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Affiliate Links</p>
                <p className="text-2xl font-bold text-neutral-900">{affiliateLinks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Clicks</p>
                <p className="text-2xl font-bold text-neutral-900">{shopStats.totalClicks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Earnings</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(shopStats.totalEarnings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div></div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="w-full h-48 bg-neutral-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-neutral-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No approved products yet</h3>
            <p className="text-neutral-600 mb-4">Submit product enquiries to get products approved for selling.</p>
            <Button onClick={() => (window.location.href = "/seller/all-products")}>Browse Products</Button>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const affiliateLink = getAffiliateLink(product._id)
            return (
              <Card
                key={product._id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={product.images[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-primary-600">{formatCurrency(product.price)}</span>
                    <Badge variant="secondary">{product.affiliatePercentage}% commission</Badge>
                  </div>
                  <div className="space-y-2">
                    {affiliateLink ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-neutral-600">
                          <span>Clicks: {affiliateLink.clicks}</span>
                          <span>Conversions: {affiliateLink.conversions}</span>
                        </div>
                        <div className="text-sm text-neutral-600 mb-2">
                          Earnings: {formatCurrency(affiliateLink.earnings)}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => copyAffiliateLink(affiliateLink.affiliateCode)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Link
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button className="w-full" size="sm" onClick={() => generateAffiliateLink(product._id)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Generate Affiliate Link
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Product Details Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={selectedProduct.images[0] || "/placeholder.jpg"}
                  alt={selectedProduct.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{selectedProduct.name}</h3>
                  <p className="text-neutral-600 mb-3">{selectedProduct.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">{formatCurrency(selectedProduct.price)}</span>
                    <Badge variant="secondary">{selectedProduct.affiliatePercentage}% commission</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-neutral-700">Category:</span>
                  <span className="ml-2 text-neutral-600">{selectedProduct.category}</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Stock:</span>
                  <span className="ml-2 text-neutral-600">{selectedProduct.stock}</span>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Status:</span>
                  <Badge variant="success" className="ml-2">
                    {selectedProduct.status}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Added:</span>
                  <span className="ml-2 text-neutral-600">
                    {new Date(selectedProduct.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {getAffiliateLink(selectedProduct._id) && (
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <h4 className="font-semibold text-neutral-900 mb-2">Affiliate Performance</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-neutral-700">Clicks:</span>
                      <span className="ml-2 text-neutral-600">{getAffiliateLink(selectedProduct._id)?.clicks}</span>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-700">Conversions:</span>
                      <span className="ml-2 text-neutral-600">
                        {getAffiliateLink(selectedProduct._id)?.conversions}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-700">Earnings:</span>
                      <span className="ml-2 text-neutral-600">
                        {formatCurrency(getAffiliateLink(selectedProduct._id)?.earnings || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Shop Analytics</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary-600">{shopStats.totalProducts}</div>
                  <div className="text-sm text-neutral-600">Total Products</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success-600">{shopStats.totalClicks}</div>
                  <div className="text-sm text-neutral-600">Total Clicks</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning-600">{formatCurrency(shopStats.totalEarnings)}</div>
                  <div className="text-sm text-neutral-600">Total Earnings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary-600">{shopStats.conversionRate.toFixed(1)}%</div>
                  <div className="text-sm text-neutral-600">Conversion Rate</div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-4">Top Performing Products</h4>
              <div className="space-y-3">
                {affiliateLinks
                  .sort((a, b) => b.earnings - a.earnings)
                  .slice(0, 5)
                  .map((link) => (
                    <div key={link._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={link.productId.images[0] || "/placeholder.jpg"}
                          alt={link.productId.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-medium text-neutral-900">{link.productId.name}</div>
                          <div className="text-sm text-neutral-600">
                            {link.clicks} clicks • {link.conversions} conversions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary-600">{formatCurrency(link.earnings)}</div>
                        <div className="text-sm text-neutral-600">
                          {link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(1) : 0}% CVR
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
