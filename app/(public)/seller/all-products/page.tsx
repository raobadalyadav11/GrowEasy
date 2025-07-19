"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Eye, Plus, Package, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  subcategory?: string
  affiliatePercentage: number
  status: string
  featured: boolean
  sellerId?: string
  createdAt: string
  stock: number
  specifications: Record<string, any>
}

interface EnquiryData {
  productId: string
  productName: string
  description: string
  category: string
  subcategory?: string
  suggestedPrice: number
  customMessage: string
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all") // Updated default value
  const [sortBy, setSortBy] = useState("createdAt")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [enquiryData, setEnquiryData] = useState<EnquiryData>({
    productId: "",
    productName: "",
    description: "",
    category: "",
    subcategory: "",
    suggestedPrice: 0,
    customMessage: "",
  })
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [currentPage, categoryFilter, sortBy, searchTerm])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        status: "active", // Only show active products
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        ...(sortBy && { sort: sortBy }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/seller/available-products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setTotalPages(data.pagination?.pages || 1)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnquirySubmit = async (product: Product) => {
    setSelectedProduct(product)
    setEnquiryData({
      productId: product._id,
      productName: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory || "",
      suggestedPrice: product.price,
      customMessage: "",
    })
    setIsDialogOpen(true)
  }

  const submitEnquiry = async () => {
    if (!enquiryData.customMessage.trim()) {
      alert("Please add a custom message for your enquiry")
      return
    }

    setIsSubmittingEnquiry(true)
    try {
      const response = await fetch("/api/seller/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: enquiryData.productId,
          productName: enquiryData.productName,
          description: enquiryData.description,
          category: enquiryData.category,
          subcategory: enquiryData.subcategory,
          suggestedPrice: enquiryData.suggestedPrice,
          customMessage: enquiryData.customMessage,
        }),
      })

      if (response.ok) {
        alert("Product enquiry submitted successfully! Admin will review and approve.")
        setIsDialogOpen(false)
        setEnquiryData({
          productId: "",
          productName: "",
          description: "",
          category: "",
          subcategory: "",
          suggestedPrice: 0,
          customMessage: "",
        })
      } else {
        const error = await response.json()
        alert(error.error || "Failed to submit enquiry")
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error)
      alert("Failed to submit enquiry")
    } finally {
      setIsSubmittingEnquiry(false)
    }
  }

  const viewProductDetails = (productId: string) => {
    window.open(`/products/${productId}`, "_blank")
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Available Products</h1>
        <p className="text-neutral-600 mt-2">Browse admin-added products and submit enquiries to start selling</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Available Products</p>
                <p className="text-2xl font-bold text-neutral-900">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <Star className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Featured</p>
                <p className="text-2xl font-bold text-neutral-900">{products.filter((p) => p.featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Package className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Categories</p>
                <p className="text-2xl font-bold text-neutral-900">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <Package className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Avg Commission</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {products.length > 0
                    ? Math.round(products.reduce((sum, p) => sum + p.affiliatePercentage, 0) / products.length)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem> {/* Updated value prop */}
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Newest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price">Price Low to High</SelectItem>
                <SelectItem value="affiliatePercentage">Commission High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <div className="animate-pulse">
                  <div className="w-full h-48 bg-neutral-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                    <div className="h-8 bg-neutral-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
            <p className="text-neutral-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.featured && <Badge className="absolute top-2 left-2 bg-warning-500">Featured</Badge>}
                  <Badge className="absolute top-2 right-2 bg-success-500">
                    {product.affiliatePercentage}% Commission
                  </Badge>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => viewProductDetails(product._id)}
                      className="mr-2"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-primary-600">{formatCurrency(product.price)}</span>
                      {product.comparePrice && (
                        <span className="text-sm text-neutral-500 line-through">
                          {formatCurrency(product.comparePrice)}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-neutral-600">Stock: {product.stock}</span>
                    <Badge variant="secondary" className="text-green-600">
                      {product.affiliatePercentage}% commission
                    </Badge>
                  </div>

                  <Button onClick={() => handleEnquirySubmit(product)} className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Enquiry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Enquiry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Product Enquiry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProduct && (
              <div className="flex gap-4 p-4 bg-neutral-50 rounded-lg">
                <img
                  src={selectedProduct.images[0] || "/placeholder.jpg"}
                  alt={selectedProduct.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900">{selectedProduct.name}</h4>
                  <p className="text-sm text-neutral-600 line-clamp-2">{selectedProduct.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-primary-600">{formatCurrency(selectedProduct.price)}</span>
                    <Badge variant="secondary">{selectedProduct.affiliatePercentage}% commission</Badge>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={enquiryData.productName}
                  onChange={(e) => setEnquiryData({ ...enquiryData, productName: e.target.value })}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={enquiryData.category}
                  onChange={(e) => setEnquiryData({ ...enquiryData, category: e.target.value })}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="suggestedPrice">Suggested Price</Label>
                <Input
                  id="suggestedPrice"
                  type="number"
                  value={enquiryData.suggestedPrice}
                  onChange={(e) =>
                    setEnquiryData({ ...enquiryData, suggestedPrice: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={enquiryData.subcategory}
                  onChange={(e) => setEnquiryData({ ...enquiryData, subcategory: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customMessage">Custom Message *</Label>
              <Textarea
                id="customMessage"
                placeholder="Explain why you want to sell this product, your experience, target market, etc."
                value={enquiryData.customMessage}
                onChange={(e) => setEnquiryData({ ...enquiryData, customMessage: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitEnquiry} disabled={isSubmittingEnquiry}>
                {isSubmittingEnquiry ? "Submitting..." : "Submit Enquiry"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
