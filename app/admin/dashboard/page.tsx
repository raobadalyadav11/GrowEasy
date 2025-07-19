"use client"

import { useEffect, useState } from "react"
import { Users, ShoppingBag, Package, DollarSign, TrendingUp, Clock } from "lucide-react"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatCurrency, formatDate } from "@/lib/utils"

interface AdminStats {
  totalUsers: number
  totalSellers: number
  pendingSellers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: any[]
  recentSellers: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
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
          {[...Array(6)].map((_, i) => (
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
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "primary",
      description: "Registered customers",
    },
    {
      title: "Total Sellers",
      value: stats?.totalSellers || 0,
      icon: ShoppingBag,
      color: "success",
      description: "Active sellers",
    },
    {
      title: "Pending Approvals",
      value: stats?.pendingSellers || 0,
      icon: Clock,
      color: "warning",
      description: "Sellers awaiting approval",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "secondary",
      description: "Listed products",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: TrendingUp,
      color: "info",
      description: "All time orders",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: "success",
      description: "Platform revenue",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-600 mt-2">Monitor and manage your e-commerce platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Recent Orders</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {stats?.recentOrders?.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-neutral-900">#{order.orderNumber}</p>
                    <p className="text-sm text-neutral-600">
                      {order.customerId?.profile?.firstName} {order.customerId?.profile?.lastName}
                    </p>
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

        {/* Recent Sellers */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Recent Seller Applications</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {stats?.recentSellers?.map((seller, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-neutral-900">
                      {seller.profile?.firstName} {seller.profile?.lastName}
                    </p>
                    <p className="text-sm text-neutral-600">{seller.email}</p>
                    <p className="text-xs text-neutral-500">{seller.businessInfo?.businessName}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        seller.status === "approved" ? "success" : seller.status === "pending" ? "warning" : "error"
                      }
                    >
                      {seller.status}
                    </Badge>
                    <p className="text-xs text-neutral-500 mt-1">{formatDate(seller.createdAt)}</p>
                  </div>
                </div>
              )) || <p className="text-neutral-500 text-center py-4">No recent applications</p>}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
