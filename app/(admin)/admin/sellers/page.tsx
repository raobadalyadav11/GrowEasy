"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Eye, Check, X, User } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"

interface Seller {
  _id: string
  email: string
  status: "pending" | "approved" | "rejected"
  profile: {
    firstName: string
    lastName: string
    phone?: string
  }
  businessInfo?: {
    businessName: string
    businessType: string
    gstNumber?: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  bankDetails?: {
    accountNumber: string
    ifscCode: string
    accountHolderName: string
    bankName: string
  }
  documents?: {
    aadharCard?: string
    panCard?: string
    bankPassbook?: string
    gstCertificate?: string
  }
  createdAt: string
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchSellers()
  }, [currentPage, statusFilter, searchTerm])

  const fetchSellers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/admin/sellers?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSellers(data.sellers)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error("Error fetching sellers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (sellerId: string) => {
    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/approve`, {
        method: "POST",
      })

      if (response.ok) {
        fetchSellers()
        alert("Seller approved successfully!")
      }
    } catch (error) {
      console.error("Error approving seller:", error)
      alert("Failed to approve seller")
    }
  }

  const handleReject = async (sellerId: string) => {
    const reason = prompt("Please provide a reason for rejection:")
    if (!reason) return

    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      })

      if (response.ok) {
        fetchSellers()
        alert("Seller rejected successfully!")
      }
    } catch (error) {
      console.error("Error rejecting seller:", error)
      alert("Failed to reject seller")
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success"
      case "pending":
        return "warning"
      case "rejected":
        return "error"
      default:
        return "secondary"
    }
  }

  const viewSellerDetails = (seller: Seller) => {
    setSelectedSeller(seller)
    setShowDetails(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Seller Management</h1>
          <p className="text-neutral-600 mt-2">Manage seller applications and approvals</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search sellers..."
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

      {/* Sellers Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">All Sellers</h3>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 py-4">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
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
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {sellers.map((seller) => (
                    <tr key={seller._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900">
                              {seller.profile.firstName} {seller.profile.lastName}
                            </div>
                            <div className="text-sm text-neutral-500">{seller.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">{seller.businessInfo?.businessName || "N/A"}</div>
                        <div className="text-sm text-neutral-500">{seller.businessInfo?.businessType || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(seller.status)}>{seller.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {formatDate(seller.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => viewSellerDetails(seller)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {seller.status === "pending" && (
                            <>
                              <Button variant="success" size="sm" onClick={() => handleApprove(seller._id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="error" size="sm" onClick={() => handleReject(seller._id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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

      {/* Seller Details Modal */}
      {showDetails && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">Seller Details</h2>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Name</label>
                        <p className="text-neutral-900">
                          {selectedSeller.profile.firstName} {selectedSeller.profile.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Email</label>
                        <p className="text-neutral-900">{selectedSeller.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Phone</label>
                        <p className="text-neutral-900">{selectedSeller.profile.phone || "N/A"}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Business Information */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Business Information</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Business Name</label>
                        <p className="text-neutral-900">{selectedSeller.businessInfo?.businessName || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Business Type</label>
                        <p className="text-neutral-900">{selectedSeller.businessInfo?.businessType || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">GST Number</label>
                        <p className="text-neutral-900">{selectedSeller.businessInfo?.gstNumber || "N/A"}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Address */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Address</h3>
                  </CardHeader>
                  <CardBody>
                    {selectedSeller.businessInfo?.address && (
                      <div className="space-y-1">
                        <p className="text-neutral-900">{selectedSeller.businessInfo.address.street}</p>
                        <p className="text-neutral-900">
                          {selectedSeller.businessInfo.address.city}, {selectedSeller.businessInfo.address.state}
                        </p>
                        <p className="text-neutral-900">
                          {selectedSeller.businessInfo.address.zipCode}, {selectedSeller.businessInfo.address.country}
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Bank Details */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Bank Details</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Account Holder</label>
                        <p className="text-neutral-900">{selectedSeller.bankDetails?.accountHolderName || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Bank Name</label>
                        <p className="text-neutral-900">{selectedSeller.bankDetails?.bankName || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Account Number</label>
                        <p className="text-neutral-900">
                          {selectedSeller.bankDetails?.accountNumber
                            ? "****" + selectedSeller.bankDetails.accountNumber.slice(-4)
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">IFSC Code</label>
                        <p className="text-neutral-900">{selectedSeller.bankDetails?.ifscCode || "N/A"}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Documents */}
              {selectedSeller.documents && (
                <Card className="mt-6">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Documents</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedSeller.documents.aadharCard && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600">Aadhar Card</label>
                          <a
                            href={selectedSeller.documents.aadharCard}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-primary-600 hover:text-primary-700 underline"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                      {selectedSeller.documents.panCard && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600">PAN Card</label>
                          <a
                            href={selectedSeller.documents.panCard}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-primary-600 hover:text-primary-700 underline"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                      {selectedSeller.documents.bankPassbook && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600">Bank Passbook</label>
                          <a
                            href={selectedSeller.documents.bankPassbook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-primary-600 hover:text-primary-700 underline"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                      {selectedSeller.documents.gstCertificate && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600">GST Certificate</label>
                          <a
                            href={selectedSeller.documents.gstCertificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-primary-600 hover:text-primary-700 underline"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Actions */}
              {selectedSeller.status === "pending" && (
                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    variant="error"
                    onClick={() => {
                      handleReject(selectedSeller._id)
                      setShowDetails(false)
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => {
                      handleApprove(selectedSeller._id)
                      setShowDetails(false)
                    }}
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
