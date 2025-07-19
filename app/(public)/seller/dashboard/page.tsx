"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Bell,
  Store,
  FileText,
  Wallet,
  BarChart3,
} from "lucide-react"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import { formatCurrency, formatDate } from "@/lib/utils"

interface DashboardStats {
  totalEarnings: number
  pendingEnquiries: number
  approvedEnquiries: number
  rejectedEnquiries: number
  totalOrders: number
  affiliateLinks: number
  walletBalance: number
  unreadNotifications: number
  shopOrders: number
  affiliateOrders: number
  totalClicks: number
  conversionRate: number
}

interface RecentActivity {
  type: "order" | "enquiry" | "payout" | "notification"
  title: string
  description: string
  amount?: number
  status?: string
  createdAt: string
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    pendingEnquiries: 0,
    approvedEnquiries: 0,
    rejectedEnquiries: 0,
    totalOrders: 0,
    affiliateLinks: 0,
    walletBalance: 0,
    unreadNotifications: 0,
    shopOrders: 0,
    affiliateOrders: 0,
    totalClicks: 0,
    conversionRate: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/seller/dashboard")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentActivity(data.recentActivity || [])
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const quickLinks = [
    {
      title: "Product Enquiries",
      description: "Submit new product enquiries",
      href: "/seller/enquiries",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
      count: stats.pendingEnquiries,
    },
    {
      title: "My Products",
      description: "Manage approved products",
      href: "/seller/products",
      icon: Package,
      color: "bg-green-100 text-green-600",
      count: stats.approvedEnquiries,
    },
    {
      title: "Shop Management",
      description: "Customize your shop",
      href: "/seller/shop",
      icon: Store,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Affiliate Links",
      description: "Track link performance",
      href: "/seller/affiliate-links",
      icon: ExternalLink,
      color: "bg-orange-100 text-orange-600",
      count: stats.affiliateLinks,
    },
    {
      title: "Orders",
      description: "View order history",
      href: "/seller/orders",
      icon: ShoppingCart,
      color: "bg-indigo-100 text-indigo-600",
      count: stats.totalOrders,
    },
    {
      title: "Wallet",
      description: "Manage earnings & payouts",
      href: "/seller/wallet",
      icon: Wallet,
      color: "bg-yellow-100 text-yellow-600",
      amount: stats.walletBalance,
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4 text-green-600" />
      case "enquiry":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "payout":
        return <DollarSign className="h-4 w-4 text-yellow-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Seller Dashboard</h1>
          <p className="text-neutral-600 mt-2">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/seller/notifications">
            <Button variant="outline" className="relative bg-transparent">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {stats.unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {stats.unreadNotifications}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/seller/enquiries">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Enquiry
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Earnings</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(stats.totalEarnings)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Wallet Balance</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(stats.walletBalance)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Orders</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalOrders}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Performance Overview</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.pendingEnquiries}</div>
                <div className="text-sm text-neutral-600">Pending Enquiries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approvedEnquiries}</div>
                <div className="text-sm text-neutral-600">Approved Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.affiliateLinks}</div>
                <div className="text-sm text-neutral-600">Affiliate Links</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.totalClicks}</div>
                <div className="text-sm text-neutral-600">Total Clicks</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Order Sources</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Store className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm text-neutral-600">Shop Orders</span>
                </div>
                <span className="font-semibold text-neutral-900">{stats.shopOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ExternalLink className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="text-sm text-neutral-600">Affiliate Orders</span>
                </div>
                <span className="font-semibold text-neutral-900">{stats.affiliateOrders}</span>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <div className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${link.color}`}>
                        <link.icon className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-neutral-900">{link.title}</h4>
                        <p className="text-sm text-neutral-600">{link.description}</p>
                      </div>
                    </div>
                    {link.count !== undefined && <Badge variant="secondary">{link.count}</Badge>}
                    {link.amount !== undefined && (
                      <span className="text-sm font-semibold text-green-600">{formatCurrency(link.amount)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
            <Link href="/seller/notifications">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <h4 className="text-lg font-medium text-neutral-900 mb-2">No recent activity</h4>
              <p className="text-neutral-600">Your recent activities will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 py-3 border-b border-neutral-100 last:border-b-0"
                >
                  <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{activity.title}</p>
                    <p className="text-sm text-neutral-600">{activity.description}</p>
                    <p className="text-xs text-neutral-500 mt-1">{formatDate(activity.createdAt)}</p>
                  </div>
                  {activity.amount && (
                    <div className="flex-shrink-0">
                      <span className="text-sm font-semibold text-green-600">{formatCurrency(activity.amount)}</span>
                    </div>
                  )}
                  {activity.status && (
                    <div className="flex-shrink-0">
                      <Badge variant={activity.status === "completed" ? "success" : "warning"}>{activity.status}</Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
