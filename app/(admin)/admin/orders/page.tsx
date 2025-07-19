"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Order {
  _id: string
  orderNumber: string
  customerId: {
    profile: {
      firstName: string
      lastName: string
    }
    email: string
  }
  items: Array<{
    name: string
    price: number
    quantity: number
    sellerId: {
      profile: {
        firstName: string
        lastName: string
      }
      businessInfo?: {
        businessName: string
      }
    }
  }>
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  trackingNumber?: string
  createdAt: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter, searchTerm])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, trackingNumber }),
      })

      if (response.ok) {
        fetchOrders()
        alert("Order updated successfully!")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Failed to update order")
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "success"
      case "shipped":
        return "info"
      case "processing":
        return "warning"
      case "cancelled":
        return "error"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return CheckCircle
      case "shipped":
        return Truck
      case "processing":
        return Package
      case "cancelled":
        return XCircle
      default:
        return Package
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Order Management</h1>
          <p className="text-neutral-600 mt-2">Monitor and manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">All Orders</h3>
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
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Total
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
                  {orders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status)
                    return (
                      <tr key={order._id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                <StatusIcon className="h-5 w-5 text-primary-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">#{order.orderNumber}</div>
                              <div className="text-sm text-neutral-500">
                                {order.trackingNumber && `Tracking: ${order.trackingNumber}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">
                            {order.customerId.profile.firstName} {order.customerId.profile.lastName}
                          </div>
                          <div className="text-sm text-neutral-500">{order.customerId.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">{order.items.length} items</div>
                          <div className="text-sm text-neutral-500">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div key={idx}>{item.name}</div>
                            ))}
                            {order.items.length > 2 && <div>+{order.items.length - 2} more</div>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowDetails(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
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

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">Order Details</h2>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Info */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Order Information</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Order Number</label>
                        <p className="text-neutral-900">#{selectedOrder.orderNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Status</label>
                        <p className="text-neutral-900">
                          <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Total Amount</label>
                        <p className="text-neutral-900">{formatCurrency(selectedOrder.total)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Payment Method</label>
                        <p className="text-neutral-900">{selectedOrder.paymentMethod}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Payment Status</label>
                        <p className="text-neutral-900">{selectedOrder.paymentStatus}</p>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600">Tracking Number</label>
                          <p className="text-neutral-900">{selectedOrder.trackingNumber}</p>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>

                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Customer Information</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Name</label>
                        <p className="text-neutral-900">
                          {selectedOrder.customerId.profile.firstName} {selectedOrder.customerId.profile.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Email</label>
                        <p className="text-neutral-900">{selectedOrder.customerId.email}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Order Items */}
              <Card className="mt-6">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Order Items</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-neutral-100">
                        <div>
                          <p className="font-medium text-neutral-900">{item.name}</p>
                          <p className="text-sm text-neutral-500">
                            Seller:{" "}
                            {item.sellerId.businessInfo?.businessName ||
                              `${item.sellerId.profile.firstName} ${item.sellerId.profile.lastName}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-neutral-900">
                            {item.quantity} × {formatCurrency(item.price)}
                          </p>
                          <p className="text-sm text-neutral-500">{formatCurrency(item.quantity * item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Update Order */}
              <div className="flex justify-end space-x-4 mt-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-neutral-600">Update Status:</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      updateOrderStatus(selectedOrder._id, e.target.value)
                      setShowDetails(false)
                    }}
                    className="border rounded px-3 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
