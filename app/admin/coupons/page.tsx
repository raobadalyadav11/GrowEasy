"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Percent } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"

interface Coupon {
  _id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit: number
  usedCount: number
  expiryDate: string
  isActive: boolean
  createdAt: string
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 1,
    expiryDate: "",
    isActive: true,
  })

  useEffect(() => {
    fetchCoupons()
  }, [currentPage, statusFilter, searchTerm])

  const fetchCoupons = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/admin/coupons?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCoupons(data.coupons)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error("Error fetching coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCoupon ? `/api/admin/coupons/${editingCoupon._id}` : "/api/admin/coupons"
      const method = editingCoupon ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchCoupons()
        setShowForm(false)
        setEditingCoupon(null)
        setFormData({
          code: "",
          type: "percentage",
          value: 0,
          minOrderAmount: 0,
          maxDiscount: 0,
          usageLimit: 1,
          expiryDate: "",
          isActive: true,
        })
        alert(editingCoupon ? "Coupon updated successfully!" : "Coupon created successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save coupon")
      }
    } catch (error) {
      console.error("Error saving coupon:", error)
      alert("Failed to save coupon")
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit,
      expiryDate: new Date(coupon.expiryDate).toISOString().split("T")[0],
      isActive: coupon.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = async (couponId: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        const response = await fetch(`/api/admin/coupons/${couponId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchCoupons()
          alert("Coupon deleted successfully!")
        }
      } catch (error) {
        console.error("Error deleting coupon:", error)
        alert("Failed to delete coupon")
      }
    }
  }

  const toggleStatus = async (coupon: Coupon) => {
    try {
      const response = await fetch(`/api/admin/coupons/${coupon._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      })

      if (response.ok) {
        fetchCoupons()
      }
    } catch (error) {
      console.error("Error updating coupon status:", error)
    }
  }

  const getStatusBadgeVariant = (coupon: Coupon) => {
    if (!coupon.isActive) return "error"
    if (new Date(coupon.expiryDate) < new Date()) return "warning"
    return "success"
  }

  const getStatusText = (coupon: Coupon) => {
    if (!coupon.isActive) return "Inactive"
    if (new Date(coupon.expiryDate) < new Date()) return "Expired"
    return "Active"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Coupon Management</h1>
          <p className="text-neutral-600 mt-2">Create and manage discount coupons</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">All Coupons</h3>
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
                  <div className="w-20 h-6 bg-neutral-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Expiry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                              <Percent className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900">{coupon.code}</div>
                            <div className="text-sm text-neutral-500">{coupon.type} discount</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">
                          {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                        </div>
                        {coupon.minOrderAmount && (
                          <div className="text-sm text-neutral-500">Min order: ₹{coupon.minOrderAmount}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">
                          {coupon.usedCount} / {coupon.usageLimit}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {Math.round((coupon.usedCount / coupon.usageLimit) * 100)}% used
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {formatDate(coupon.expiryDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(coupon)}>{getStatusText(coupon)}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(coupon)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={coupon.isActive ? "warning" : "success"}
                            size="sm"
                            onClick={() => toggleStatus(coupon)}
                          >
                            {coupon.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(coupon._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* Add/Edit Coupon Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCoupon(null)
                  }}
                >
                  ×
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Coupon Code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SAVE20"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Discount Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as "percentage" | "fixed" })}
                      className="input"
                      required
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={formData.type === "percentage" ? "Discount Percentage" : "Discount Amount (₹)"}
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    min="1"
                    max={formData.type === "percentage" ? "100" : undefined}
                    required
                  />
                  <Input
                    label="Usage Limit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Minimum Order Amount (₹)"
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    min="0"
                  />
                  {formData.type === "percentage" && (
                    <Input
                      label="Maximum Discount (₹)"
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                      min="0"
                    />
                  )}
                </div>

                <Input
                  label="Expiry Date"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-neutral-700">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingCoupon(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editingCoupon ? "Update Coupon" : "Create Coupon"}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
