"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Copy, Eye, TrendingUp, Package } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
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

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  useEffect(() => {
    fetchProducts()
    fetchAffiliateLinks()
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
    const link = `${window.location.origin}/product/${affiliateCode}`
    navigator.clipboard.writeText(link)
    alert("Affiliate link copied to clipboard!")
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
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">My Products</h1>
        <p className="text-neutral-600 mt-2">Manage approved products and generate affiliate links</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Available Products</p>
                <p className="text-2xl font-bold text-neutral-900">{products.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <ExternalLink className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Affiliate Links</p>
                <p className="text-2xl font-bold text-neutral-900">{affiliateLinks.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Clicks</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {affiliateLinks.reduce((sum, link) => sum + link.clicks, 0)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Earnings</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatCurrency(affiliateLinks.reduce((sum, link) => sum + link.earnings, 0))}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
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
        </CardBody>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardBody>
                <div className="animate-pulse">
                  <div className="w-full h-48 bg-neutral-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-neutral-200 rounded"></div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No products available</h3>
            <p className="text-neutral-600 mb-4">Submit product enquiries to get products approved for selling.</p>
            <Button onClick={() => (window.location.href = "/seller/enquiries")}>Submit Enquiry</Button>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const affiliateLink = getAffiliateLink(product._id)
            return (
              <Card key={product._id} className="hover-lift">
                <CardBody>
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={product.images[0] || "/placeholder.svg?height=200&width=300"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{product.name}</h3>
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
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button className="w-full" size="sm" onClick={() => generateAffiliateLink(product._id)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Generate Link
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
