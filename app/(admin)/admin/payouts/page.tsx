"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Download, CreditCard, Clock, CheckCircle, XCircle } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Payout {
  _id: string
  sellerId: {
    _id: string
    profile: {
      firstName: string
      lastName: string
    }
    email: string
  }
  amount: number
  status: "pending" | "processing" | "completed" | "failed"
  payoutMethod: "bank_transfer" | "upi" | "wallet"
  bankDetails: {
    accountNumber: string
    ifscCode: string
    bankName: string
    accountHolderName: string
  }
  razorpayPayoutId?: string
  failureReason?: string
  processedAt?: string
  createdAt: string
  updatedAt: string
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchPayouts()
  }, [currentPage, statusFilter, searchTerm])

  const fetchPayouts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/admin/payouts?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPayouts(data.payouts)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error("Error fetching payouts:", error)
    } finally {
      setLoading(false)
    }
  }

  const processPayout = async (payoutId: string) => {
    setProcessing(payoutId)
    try {
      const response = await fetch(`/api/admin/payouts/${payoutId}/process`, {
        method: "POST",
      })

      if (response.ok) {
        fetchPayouts()
        alert("Payout processed successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to process payout")
      }
    } catch (error) {
      console.error("Error processing payout:", error)
      alert("Failed to process payout")
    } finally {
      setProcessing(null)
    }
  }

  const rejectPayout = async (payoutId: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/payouts/${payoutId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      })

      if (response.ok) {
        fetchPayouts()
        alert("Payout rejected successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to reject payout")
      }
    } catch (error) {
      console.error("Error rejecting payout:", error)
      alert("Failed to reject payout")
    }
  }

  const exportPayouts = () => {
    const csvContent = [
      ["Seller Name", "Email", "Amount", "Status", "Method", "Date", "Processed Date"],
      ...payouts.map((payout) => [
        `${payout.sellerId.profile.firstName} ${payout.sellerId.profile.lastName}`,
        payout.sellerId.email,
        payout.amount.toString(),
        payout.status,
        payout.payoutMethod,
        formatDate(payout.createdAt),
        payout.processedAt ? formatDate(payout.processedAt) : "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "payouts-report.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "failed":
        return "error"
      case "processing":
        return "warning"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const totalStats = {
    totalAmount: payouts.reduce((sum, payout) => sum + payout.amount, 0),
    pendingAmount: payouts.filter((p) => p.status === "pending").reduce((sum, payout) => sum + payout.amount, 0),
    completedAmount: payouts.filter((p) => p.status === "completed").reduce((sum, payout) => sum + payout.amount, 0),
    failedAmount: payouts.filter((p) => p.status === "failed").reduce((sum, payout) => sum + payout.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Payout Management</h1>
          <p className="text-neutral-600 mt-2">Manage seller payouts and transactions</p>
        </div>
        <Button onClick={exportPayouts} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Payouts</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(totalStats.totalAmount)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Clock className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Pending</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(totalStats.pendingAmount)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Completed</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(totalStats.completedAmount)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-error-100 rounded-lg">
                <XCircle className="h-6 w-6 text-error-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Failed</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(totalStats.failedAmount)}</p>
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
                placeholder="Search by seller name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">All Payouts</h3>
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
                  <div className="w-20 h-4 bg-neutral-200 rounded"></div>
                  <div className="w-16 h-6 bg-neutral-200 rounded"></div>
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
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {payouts.map((payout) => (
                    <tr key={payout._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">
                                {payout.sellerId.profile.firstName[0]}
                                {payout.sellerId.profile.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900">
                              {payout.sellerId.profile.firstName} {payout.sellerId.profile.lastName}
                            </div>
                            <div className="text-sm text-neutral-500">{payout.sellerId.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">{formatCurrency(payout.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900 capitalize">
                          {payout.payoutMethod.replace("_", " ")}
                        </div>
                        {payout.bankDetails && (
                          <div className="text-sm text-neutral-500">
                            {payout.bankDetails.accountNumber.slice(-4)} • {payout.bankDetails.bankName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(payout.status)} className="flex items-center space-x-1">
                          {getStatusIcon(payout.status)}
                          <span className="capitalize">{payout.status}</span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">{formatDate(payout.createdAt)}</div>
                        {payout.processedAt && (
                          <div className="text-sm text-neutral-500">Processed: {formatDate(payout.processedAt)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {payout.status === "pending" && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => processPayout(payout._id)}
                                loading={processing === payout._id}
                              >
                                Process
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const reason = prompt("Enter rejection reason:")
                                  if (reason) rejectPayout(payout._id, reason)
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {payout.status === "failed" && payout.failureReason && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => alert(`Failure reason: ${payout.failureReason}`)}
                            >
                              View Error
                            </Button>
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
    </div>
  )
}
