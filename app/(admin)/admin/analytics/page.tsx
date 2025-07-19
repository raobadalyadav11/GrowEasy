"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, Package, DollarSign, Percent } from "lucide-react"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { formatCurrency } from "@/lib/utils"

interface AnalyticsData {
  sales: {
    total: number
    totalOrders: number
    monthly: number
    monthlyOrders: number
    weekly: number
    weeklyOrders: number
    daily: number
    dailyOrders: number
  }
  users: {
    total: number
    newThisMonth: number
    byRole: Array<{ _id: string; count: number }>
  }
  products: {
    total: number
    byCategory: Array<{ _id: string; count: number }>
    topSelling: Array<{
      _id: string
      totalSold: number
      product: Array<{ name: string; price: number }>
    }>
  }
  coupons: {
    total: number
    active: number
    totalUsed: number
  }
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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

  if (!analytics) {
    return <div>Error loading analytics data</div>
  }

  const salesCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(analytics.sales.total),
      icon: DollarSign,
      color: "success",
      description: `${analytics.sales.totalOrders} orders`,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(analytics.sales.monthly),
      icon: TrendingUp,
      color: "primary",
      description: `${analytics.sales.monthlyOrders} orders this month`,
    },
    {
      title: "Weekly Revenue",
      value: formatCurrency(analytics.sales.weekly),
      icon: TrendingUp,
      color: "info",
      description: `${analytics.sales.weeklyOrders} orders this week`,
    },
    {
      title: "Daily Revenue",
      value: formatCurrency(analytics.sales.daily),
      icon: TrendingUp,
      color: "warning",
      description: `${analytics.sales.dailyOrders} orders today`,
    },
  ]

  const overviewCards = [
    {
      title: "Total Users",
      value: analytics.users.total,
      icon: Users,
      color: "primary",
      description: `${analytics.users.newThisMonth} new this month`,
    },
    {
      title: "Total Products",
      value: analytics.products.total,
      icon: Package,
      color: "secondary",
      description: "Listed products",
    },
    {
      title: "Active Coupons",
      value: analytics.coupons.active,
      icon: Percent,
      color: "success",
      description: `${analytics.coupons.totalUsed} total uses`,
    },
    {
      title: "Total Coupons",
      value: analytics.coupons.total,
      icon: Percent,
      color: "info",
      description: "All coupons created",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Analytics & Reports</h1>
        <p className="text-neutral-600 mt-2">Platform performance insights and metrics</p>
      </div>

      {/* Sales Analytics */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Sales Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {salesCards.map((card, index) => (
            <Card key={index} className="hover-lift">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">{card.title}</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">{card.value}</p>
                    <p className="text-sm text-neutral-500 mt-1">{card.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                    <card.icon className={`h-6 w-6 text-${card.color}-600`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Overview Analytics */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((card, index) => (
            <Card key={index} className="hover-lift">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">{card.title}</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">{card.value}</p>
                    <p className="text-sm text-neutral-500 mt-1">{card.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                    <card.icon className={`h-6 w-6 text-${card.color}-600`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Users by Role</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {analytics.users.byRole.map((role, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-700 capitalize">{role._id}</span>
                  <span className="text-sm font-bold text-neutral-900">{role.count}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Products by Category */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Products by Category</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {analytics.products.byCategory.slice(0, 5).map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-700">{category._id}</span>
                  <span className="text-sm font-bold text-neutral-900">{category.count}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top Selling Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Top Selling Products</h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Units Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {analytics.products.topSelling.slice(0, 10).map((item, index) => (
                    <tr key={index} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">
                          {item.product[0]?.name || "Unknown Product"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {formatCurrency(item.product[0]?.price || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{item.totalSold}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {formatCurrency((item.product[0]?.price || 0) * item.totalSold)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
