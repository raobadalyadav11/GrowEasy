"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Eye, Plus, Package, Star } from "lucide-react"
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
  comparePrice?: number
  images: string[]
  category: string
  subcategory?: string
  affiliatePercentage: number
  status: string
  featured: boolean
  sellerId?: string
  createdAt: string
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [currentPage, categoryFilter, sortBy])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        ...(categoryFilter && { category: categoryFilter }),
        ...(sortBy && { sort: sortBy }),
      })

      const response = await fetch(`/api/products?${params}`)
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

  const handleEnquiry = (product: Product) => {
    // Redirect to enquiry page with pre-filled data
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

  const viewProductDetails = (productId: string) => {
    window.location.href = `/seller/all-products/${productId}`
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">All Products</h1>
        <p className="text-neutral-600 mt-2">Browse all available products and submit enquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Products</p>
                <p className="text-2xl font-bold text-neutral-900">{products.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <Star className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Featured</p>
                <p className="text-2xl font-bold text-neutral-900">{products.filter((p) => p.featured).length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Package className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Categories</p>
                <p className="text-2xl font-bold text-neutral-900">{categories.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
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
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
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
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
              <option value="createdAt">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="affiliatePercentage">Sort by Commission</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => (
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
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
            <p className="text-neutral-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product._id} className="hover-lift">
              <CardBody>
                <div className="relative">
                  <img
                    src={product.images[0] || "/placeholder.svg?height=200&width=300"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  {product.featured && (
                    <Badge variant="warning" className="absolute top-2 left-2">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="secondary" className="absolute top-2 right-2">
                    {product.affiliatePercentage}%
                  </Badge>
                </div>

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
                  <Badge variant="success">{product.category}</Badge>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => viewProductDetails(product._id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => handleEnquiry(product)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Enquiry
                  </Button>
                </div>
              </CardBody>
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
    </div>
  )
}
