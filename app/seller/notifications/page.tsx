"use client"

import { useEffect, useState } from "react"
import { Bell, CheckCircle, AlertCircle, Package, DollarSign } from "lucide-react"
import Button from "@/components/ui/Button"
import { Card, CardBody } from "@/components/ui/Card"

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
          notifications.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif,
          ),
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
              <div className="ml\
