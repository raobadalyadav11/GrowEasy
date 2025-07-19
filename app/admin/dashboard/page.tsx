"use client"

import { useEffect, useState } from "react"
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"

interface DashboardStats {
  totalProducts: number
  totalSellers: number
  totalOrders: number
  totalRevenue: number
  pendingSellerApprovals: number
  pendingProductApprovals: number
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardBody>
                <div className="animate-pulse">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "primary",
      change: "+12%",
      changeType: "increase",
    },
    {
      title: "Total Sellers",
      value: stats?.totalSellers || 0,
      icon: Users,
      color: "success",
      change: "+8%",
      changeType: "increase",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "warning",
      change: "+15%",
      changeType: "increase",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "secondary",
      change: "+23%",
      changeType: "increase",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-2">
          Welcome to your admin dashboard. Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover-lift">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === "increase" ? (
                      <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-error-600 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "increase" ? "text-success-600" : "text-error-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-neutral-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Pending Approvals */}
      {(stats?.pendingSellerApprovals || stats?.pendingProductApprovals) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats.pendingSellerApprovals > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900">Pending Seller Approvals</h3>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-between">
                  <p className="text-neutral-600">{stats.pendingSellerApprovals} sellers waiting for approval</p>
                  <Badge variant="warning">{stats.pendingSellerApprovals}</Badge>
                </div>
              </CardBody>
            </Card>
          )}

          {stats.pendingProductApprovals > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900">Pending Product Approvals</h3>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-between">
                  <p className="text-neutral-600">{stats.pendingProductApprovals} products waiting for approval</p>
                  <Badge variant="warning">{stats.pendingProductApprovals}</Badge>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Recent Orders</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {stats?.recentOrders?.slice(0, 5).map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-neutral-900">#{order.orderNumber}</p>
                    <p className="text-sm text-neutral-600">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900">₹{order.total}</p>
                    <Badge
                      variant={
                        order.status === "completed" ? "success" : order.status === "pending" ? "warning" : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              )) || <p className="text-neutral-500 text-center py-4">No recent orders</p>}
            </div>
          </CardBody>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Top Products</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {stats?.topProducts?.slice(0, 5).map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-neutral-200 rounded-lg mr-3"></div>
                    <div>
                      <p className="font-medium text-neutral-900">{product.name}</p>
                      <p className="text-sm text-neutral-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900">{product.sales} sales</p>
                    <p className="text-sm text-neutral-600">₹{product.revenue}</p>
                  </div>
                </div>
              )) || <p className="text-neutral-500 text-center py-4">No product data</p>}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
