"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Share2, Heart, Plus, Eye } from "lucide-react"
import Button from "@/components/ui/Button"
import { Card, CardBody } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatCurrency } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  description: string
  shortDescription: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  subcategory?: string
  tags: string[]
  specifications: Record<string, any>
  affiliatePercentage: number
  status: string
  featured: boolean
  seoTitle?: string
  seoDescription?: string
  createdAt: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnquiry = () => {
    if (!product) return

    const enquiryData = {
      productName: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      suggestedPrice: product.price,
    }

    localStorage.setItem("enquiryData", JSON.stringify(enquiryData))
    window.location.href = "/seller/enquiries?action=new"
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.shortDescription,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Product link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Product not found</h3>
        <p className="text-neutral-600 mb-4">The product you're looking for doesn't exist.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{product.name}</h1>
          <p className="text-neutral-600">
            {product.category} • {product.subcategory}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
            <img
              src={product.images[selectedImage] || "/placeholder.svg?height=500&width=500"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary-500" : "border-neutral-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg?height=100&width=100"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {product.featured && <Badge variant="warning">Featured</Badge>}
              <Badge variant="success">{product.status}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{product.name}</h1>
            <p className="text-neutral-600 text-lg">{product.shortDescription}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-primary-600">{formatCurrency(product.price)}</span>
              {product.comparePrice && (
                <span className="text-xl text-neutral-500 line-through">{formatCurrency(product.comparePrice)}</span>
              )}
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {product.affiliatePercentage}% Commission
            </Badge>
          </div>

          <div className="flex space-x-3">
            <Button className="flex-1" onClick={handleEnquiry}>
              <Plus className="h-5 w-5 mr-2" />
              Submit Enquiry
            </Button>
            <Button variant="outline" onClick={shareProduct}>
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Product Description</h3>
              <div className="prose max-w-none">
                <p className="text-neutral-700 leading-relaxed">{product.description}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Specifications */}
        <div>
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                {product.subcategory && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subcategory</span>
                    <span className="font-medium">{product.subcategory}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-600">Commission Rate</span>
                  <span className="font-medium">{product.affiliatePercentage}%</span>
                </div>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-neutral-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Related Actions */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Seller Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="bg-transparent" onClick={handleEnquiry}>
              <Plus className="h-4 w-4 mr-2" />
              Submit Product Enquiry
            </Button>
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={() => (window.location.href = "/seller/products")}
            >
              <Eye className="h-4 w-4 mr-2" />
              View My Products
            </Button>
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={() => (window.location.href = "/seller/affiliate-links")}
            >
              <Share2 className="h-4 w-4 mr-2" />
              My Affiliate Links
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
