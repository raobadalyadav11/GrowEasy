"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingCart, DollarSign, TrendingUp, Eye, ExternalLink } from "lucide-react"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import { formatCurrency, formatDate } from "@/lib/utils"

interface SellerStats {
  totalProducts: number
  totalOrders: number
  totalEarnings: number
  walletBalance: number
  pendingProducts: number
  recentOrders: any[]
  topProducts: any[]
  affiliateStats: {
    totalClicks: number
    totalConversions: number
    conversionRate: number
  }
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<SellerStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/seller/dashboard")
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
      description: `${stats?.pendingProducts || 0} pending approval`,
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "success",
      description: "All time orders",
    },
    {
      title: "Total Earnings",
      value: formatCurrency(stats?.totalEarnings || 0),
      icon: DollarSign,
      color: "warning",
      description: "Lifetime earnings",
    },
    {
      title: "Wallet Balance",
      value: formatCurrency(stats?.walletBalance || 0),
      icon: TrendingUp,
      color: "secondary",
      description: "Available for withdrawal",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Seller Dashboard</h1>
        <p className="text-neutral-600 mt-2">Track your sales performance and manage your products.</p>
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
                  <p className="text-sm text-neutral-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Affiliate Performance */}
      {stats?.affiliateStats && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Affiliate Performance</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{stats.affiliateStats.totalClicks}</p>
                <p className="text-sm text-neutral-600">Total Clicks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success-600">{stats.affiliateStats.totalConversions}</p>
                <p className="text-sm text-neutral-600">Conversions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning-600">{stats.affiliateStats.conversionRate}%</p>
                <p className="text-sm text-neutral-600">Conversion Rate</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Recent Orders</h3>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
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
                    <p className="text-xs text-neutral-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900">{formatCurrency(order.total)}</p>
                    <Badge
                      variant={
                        order.status === "delivered" ? "success" : order.status === "pending" ? "warning" : "secondary"
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Top Performing Products</h3>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {stats?.topProducts?.slice(0, 5).map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-neutral-200 rounded-lg mr-3 flex items-center justify-center">
                      <Package className="h-5 w-5 text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{product.name}</p>
                      <p className="text-sm text-neutral-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900">{product.sales} sales</p>
                    <p className="text-sm text-neutral-600">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              )) || <p className="text-neutral-500 text-center py-4">No product data</p>}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              Add New Product
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <ExternalLink className="h-6 w-6 mb-2" />
              Generate Affiliate Link
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <DollarSign className="h-6 w-6 mb-2" />
              Request Payout
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
