"use client"

import { useEffect, useState } from "react"
import { Bell, CheckCircle, AlertCircle, Package, DollarSign, Filter } from "lucide-react"
import Button from "@/components/ui/Button"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"

interface Notification {
  _id: string
  type: "application" | "enquiry" | "order" | "payout" | "general"
  title: string
  message: string
  isRead: boolean
  data?: Record<string, any>
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [typeFilter, showUnreadOnly])

  const fetchNotifications = async () => {
    try {
      const params = new URLSearchParams({
        ...(typeFilter && { type: typeFilter }),
        ...(showUnreadOnly && { unreadOnly: "true" }),
      })

      const response = await fetch(`/api/seller/notifications?${params}`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/seller/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      })

      if (response.ok) {
        setNotifications(
          notifications.map((notif) => (notif._id === notificationId ? { ...notif, isRead: true } : notif)),
        )
        setUnreadCount(Math.max(0, unreadCount - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/seller/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAllAsRead: true }),
      })

      if (response.ok) {
        setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return <CheckCircle className="h-5 w-5 text-primary-600" />
      case "enquiry":
        return <Package className="h-5 w-5 text-warning-600" />
      case "order":
        return <Package className="h-5 w-5 text-success-600" />
      case "payout":
        return <DollarSign className="h-5 w-5 text-secondary-600" />
      default:
        return <Bell className="h-5 w-5 text-neutral-600" />
    }
  }

  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case "application":
        return "primary"
      case "enquiry":
        return "warning"
      case "order":
        return "success"
      case "payout":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-neutral-600 mt-2">
            Stay updated with your account activities {unreadCount > 0 && `(${unreadCount} unread)`}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Bell className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Notifications</p>
                <p className="text-2xl font-bold text-neutral-900">{notifications.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Unread</p>
                <p className="text-2xl font-bold text-neutral-900">{unreadCount}</p>
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
                <p className="text-sm font-medium text-neutral-600">Order Updates</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {notifications.filter((n) => n.type === "order").length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Payout Updates</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {notifications.filter((n) => n.type === "payout").length}
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
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input">
              <option value="">All Types</option>
              <option value="application">Application Updates</option>
              <option value="enquiry">Product Enquiries</option>
              <option value="order">Order Updates</option>
              <option value="payout">Payout Updates</option>
              <option value="general">General</option>
            </select>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="unreadOnly"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="rounded border-neutral-300"
              />
              <label htmlFor="unreadOnly" className="text-sm text-neutral-700">
                Show unread only
              </label>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">Recent Notifications</h3>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-start space-x-4 py-4">
                  <div className="w-10 h-10 bg-neutral-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                    <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <h4 className="text-lg font-medium text-neutral-900 mb-2">No notifications found</h4>
              <p className="text-neutral-600">You're all caught up! New notifications will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                    notification.isRead ? "bg-white border-neutral-200" : "bg-blue-50 border-blue-200"
                  } hover:bg-neutral-50`}
                >
                  <div className="flex-shrink-0 p-2 bg-white rounded-lg border border-neutral-200">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-neutral-900">{notification.title}</h4>
                          <Badge variant={getNotificationBadgeVariant(notification.type)} className="text-xs">
                            {notification.type}
                          </Badge>
                          {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-neutral-500">{formatDate(notification.createdAt)}</p>
                      </div>
                      {!notification.isRead && (
                        <Button variant="outline" size="sm" onClick={() => markAsRead(notification._id)}>
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
