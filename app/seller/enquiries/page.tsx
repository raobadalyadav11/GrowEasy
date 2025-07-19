"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Plus, Search, Filter, Eye, Edit, Trash2, Package } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import FileUpload from "@/components/ui/FileUpload"
import { formatCurrency, formatDate } from "@/lib/utils"

interface ProductEnquiry {
  _id: string
  productName: string
  description: string
  category: string
  subcategory?: string
  suggestedPrice: number
  images: string[]
  status: "pending" | "approved" | "rejected"
  adminFeedback?: string
  createdAt: string
}

export default function ProductEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ProductEnquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    subcategory: "",
    suggestedPrice: "",
    images: [] as string[],
    specifications: {},
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEnquiries()
  }, [currentPage, statusFilter, searchTerm])

  const fetchEnquiries = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/seller/enquiries?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEnquiries(data.enquiries)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/seller/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          suggestedPrice: Number.parseFloat(formData.suggestedPrice),
        }),
      })

      if (response.ok) {
        setShowAddForm(false)
        setFormData({
          productName: "",
          description: "",
          category: "",
          subcategory: "",
          suggestedPrice: "",
          images: [],
          specifications: {},
        })
        fetchEnquiries()
        alert("Product enquiry submitted successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to submit enquiry")
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error)
      alert("Failed to submit enquiry")
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = (url: string) => {
    setFormData({
      ...formData,
      images: [...formData.images, url],
    })
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success"
      case "rejected":
        return "error"
      default:
        return "warning"
    }
  }

  const categories = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Toys", "Automotive"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Product Enquiries</h1>
          <p className="text-neutral-600 mt-2">Submit product enquiries for admin approval</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Enquiry
        </Button>
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
                <p className="text-sm font-medium text-neutral-600">Total Enquiries</p>
                <p className="text-2xl font-bold text-neutral-900">{enquiries.length}</p>
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
                <p className="text-sm font-medium text-neutral-600">Pending</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {enquiries.filter((e) => e.status === "pending").length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <Package className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Approved</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {enquiries.filter((e) => e.status === "approved").length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-error-100 rounded-lg">
                <Package className="h-6 w-6 text-error-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Rejected</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {enquiries.filter((e) => e.status === "rejected").length}
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Enquiries List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">Your Enquiries</h3>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 py-4">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/6"></div>
                  </div>
                  <div className="w-20 h-4 bg-neutral-200 rounded"></div>
                  <div className="w-16 h-6 bg-neutral-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No enquiries found</h3>
              <p className="text-neutral-600 mb-4">Submit your first product enquiry to get started.</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Enquiry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enquiry) => (
                <div key={enquiry._id} className="border border-neutral-200 rounded-lg p-6 hover:bg-neutral-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-neutral-900">{enquiry.productName}</h4>
                        <Badge variant={getStatusBadgeVariant(enquiry.status)}>{enquiry.status}</Badge>
                      </div>
                      <p className="text-neutral-600 mb-2">{enquiry.description.substring(0, 150)}...</p>
                      <div className="flex items-center space-x-4 text-sm text-neutral-500">
                        <span>Category: {enquiry.category}</span>
                        <span>Price: {formatCurrency(enquiry.suggestedPrice)}</span>
                        <span>Submitted: {formatDate(enquiry.createdAt)}</span>
                      </div>
                      {enquiry.adminFeedback && enquiry.status === "rejected" && (
                        <div className="mt-3 p-3 bg-error-50 border border-error-200 rounded-lg">
                          <p className="text-sm text-error-700">
                            <strong>Admin Feedback:</strong> {enquiry.adminFeedback}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {enquiry.status === "pending" && (
                        <>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
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
        </CardBody>
      </Card>

      {/* Add Enquiry Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Submit Product Enquiry</h2>
                <button onClick={() => setShowAddForm(false)} className="text-neutral-400 hover:text-neutral-600">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Product Name"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="input"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Subcategory (Optional)"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  />
                </div>

                <Input
                  label="Suggested Price"
                  type="number"
                  step="0.01"
                  value={formData.suggestedPrice}
                  onChange={(e) => setFormData({ ...formData, suggestedPrice: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Product Images</label>
                  <FileUpload
                    label="Upload Images"
                    onUpload={handleImageUpload}
                    accept="image/*"
                    folder="products/enquiries"
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting}>
                    Submit Enquiry
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
