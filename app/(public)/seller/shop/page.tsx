"use client"

import { useEffect, useState } from "react"
import { Copy, Share2, Edit, Eye, Star, MapPin, Phone, Mail, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"

interface Shop {
  _id: string
  sellerId: string
  businessName: string
  description: string
  logo?: string
  banner?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  isActive: boolean
  rating: number
  totalReviews: number
  createdAt: string
}

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  category: string
  affiliatePercentage: number
}

interface AffiliateLink {
  _id: string
  affiliateCode: string
  productId: Product
  clicks: number
  conversions: number
  earnings: number
}

export default function SellerShopPage() {
  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editData, setEditData] = useState<Partial<Shop>>({})

  useEffect(() => {
    fetchShop()
    fetchProducts()
    fetchAffiliateLinks()
  }, [])

  const fetchShop = async () => {
    try {
      const response = await fetch("/api/seller/shop")
      if (response.ok) {
        const data = await response.json()
        setShop(data.shop)
        setEditData(data.shop)
      }
    } catch (error) {
      console.error("Error fetching shop:", error)
    }
  }

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

  const updateShop = async () => {
    try {
      const response = await fetch("/api/seller/shop", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        const data = await response.json()
        setShop(data.shop)
        setIsEditDialogOpen(false)
        alert("Shop updated successfully!")
      } else {
        alert("Failed to update shop")
      }
    } catch (error) {
      console.error("Error updating shop:", error)
      alert("Failed to update shop")
    }
  }

  const copyShopLink = () => {
    const shopUrl = `${window.location.origin}/shop/${shop?._id}`
    navigator.clipboard.writeText(shopUrl)
    alert("Shop link copied to clipboard!")
  }

  const shareShop = () => {
    if (navigator.share) {
      navigator.share({
        title: shop?.businessName,
        text: shop?.description,
        url: `${window.location.origin}/shop/${shop?._id}`,
      })
    } else {
      copyShopLink()
    }
  }

  const viewPublicShop = () => {
    window.open(`/shop/${shop?._id}`, "_blank")
  }

  if (loading) {
    return (
      <div className="space-y-6">
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
    )
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Shop not found</h3>
        <p className="text-neutral-600 mb-4">Please complete your seller profile to create your shop.</p>
        <Button onClick={() => (window.location.href = "/seller/profile")}>Complete Profile</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Shop Header */}
      <div className="relative">
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
              <h2 className="text-3xl font-bold mb-2">{shop.businessName}</h2>
              <p className="text-primary-100">Your Digital Storefront</p>
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

        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Shop
          </Button>
          <Button variant="secondary" size="sm" onClick={viewPublicShop}>
            <Eye className="h-4 w-4 mr-2" />
            View Public
          </Button>
          <Button variant="secondary" size="sm" onClick={shareShop}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Shop Info */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About Our Shop</CardTitle>
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
                      Website
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
              <CardTitle>Shop Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Products</span>
                  <span className="font-semibold">{products.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Affiliate Links</span>
                  <span className="font-semibold">{affiliateLinks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Clicks</span>
                  <span className="font-semibold">{affiliateLinks.reduce((sum, link) => sum + link.clicks, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Earnings</span>
                  <span className="font-semibold text-primary-600">
                    {formatCurrency(affiliateLinks.reduce((sum, link) => sum + link.earnings, 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-600 mb-4">No products available yet.</p>
              <Button onClick={() => (window.location.href = "/seller/all-products")}>Browse Products</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => {
                const affiliateLink = affiliateLinks.find((link) => link.productId._id === product._id)
                return (
                  <Card key={product._id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4">
                      <img
                        src={product.images[0] || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-neutral-900 mb-2 line-clamp-1">{product.name}</h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-primary-600">{formatCurrency(product.price)}</span>
                        <Badge variant="secondary">{product.affiliatePercentage}% commission</Badge>
                      </div>
                      {affiliateLink && (
                        <div className="text-xs text-neutral-600 mb-2">
                          {affiliateLink.clicks} clicks • {formatCurrency(affiliateLink.earnings)} earned
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => affiliateLink && copyShopLink()}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Link
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Shop Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Shop Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={editData.businessName || ""}
                onChange={(e) => setEditData({ ...editData, businessName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editData.description || ""}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editData.contact?.phone || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      contact: { ...editData.contact, phone: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editData.contact?.email || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      contact: { ...editData.contact, email: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                value={editData.contact?.website || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    contact: { ...editData.contact, website: e.target.value },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={editData.address?.city || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      address: { ...editData.address, city: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={editData.address?.state || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      address: { ...editData.address, state: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateShop}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
