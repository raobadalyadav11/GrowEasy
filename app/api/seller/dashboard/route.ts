import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import ProductEnquiry from "@/models/ProductEnquiry"
import AffiliateLink from "@/models/AffiliateLink"
import Order from "@/models/Order"
import Wallet from "@/models/Wallet"
import Notification from "@/models/Notification"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Fetch all data in parallel
    const [enquiries, affiliateLinks, orders, wallet, notifications] = await Promise.all([
      ProductEnquiry.find({ sellerId: user.userId }),
      AffiliateLink.find({ sellerId: user.userId }).populate("productId", "name price"),
      Order.find({ sellerId: user.userId }).populate("customerId", "profile email"),
      Wallet.findOne({ sellerId: user.userId }),
      Notification.find({ userId: user.userId, isRead: false }),
    ])

    // Calculate stats
    const stats = {
      totalEarnings: wallet?.totalEarnings || 0,
      pendingEnquiries: enquiries.filter((e) => e.status === "pending").length,
      approvedEnquiries: enquiries.filter((e) => e.status === "approved").length,
      rejectedEnquiries: enquiries.filter((e) => e.status === "rejected").length,
      totalOrders: orders.length,
      affiliateLinks: affiliateLinks.length,
      walletBalance: wallet?.balance || 0,
      unreadNotifications: notifications.length,
      shopOrders: orders.filter((o) => !o.affiliateLinkId).length,
      affiliateOrders: orders.filter((o) => o.affiliateLinkId).length,
      totalClicks: affiliateLinks.reduce((sum, link) => sum + link.clicks, 0),
      conversionRate:
        affiliateLinks.length > 0
          ? (affiliateLinks.reduce((sum, link) => sum + link.conversions, 0) /
              Math.max(
                affiliateLinks.reduce((sum, link) => sum + link.clicks, 0),
                1,
              )) *
            100
          : 0,
    }

    // Generate recent activity
    const recentActivity = [
      ...orders.slice(0, 3).map((order) => ({
        type: "order" as const,
        title: `New order #${order.orderNumber}`,
        description: `Order from ${order.customerId.profile.firstName} ${order.customerId.profile.lastName}`,
        amount: order.total,
        status: order.status,
        createdAt: order.createdAt,
      })),
      ...enquiries.slice(0, 2).map((enquiry) => ({
        type: "enquiry" as const,
        title: `Product enquiry ${enquiry.status}`,
        description: `${enquiry.productName} - ${enquiry.status}`,
        status: enquiry.status,
        createdAt: enquiry.createdAt,
      })),
      ...notifications.slice(0, 2).map((notif) => ({
        type: "notification" as const,
        title: notif.title,
        description: notif.message,
        createdAt: notif.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      stats,
      recentActivity,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
