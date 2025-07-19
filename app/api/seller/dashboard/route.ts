import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import Order from "@/models/Order"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get seller statistics
    const [totalProducts, pendingProducts, totalOrders, recentOrders, topProducts] = await Promise.all([
      Product.countDocuments({ sellerId: user.userId }),
      Product.countDocuments({ sellerId: user.userId, status: "pending" }),
      Order.countDocuments({ "items.sellerId": user.userId }),
      Order.find({ "items.sellerId": user.userId })
        .populate("customerId", "profile email")
        .sort({ createdAt: -1 })
        .limit(5),
      Product.find({ sellerId: user.userId }).sort({ createdAt: -1 }).limit(5),
    ])

    // Calculate total earnings
    const earningsResult = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.sellerId": user.userId, status: "delivered" } },
      { $group: { _id: null, total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
    ])
    const totalEarnings = earningsResult[0]?.total || 0

    return NextResponse.json({
      totalProducts,
      pendingProducts,
      totalOrders,
      totalEarnings,
      walletBalance: totalEarnings * 0.85, // 85% after platform commission
      recentOrders,
      topProducts,
      affiliateStats: {
        totalClicks: Math.floor(Math.random() * 1000),
        totalConversions: Math.floor(Math.random() * 100),
        conversionRate: (Math.random() * 10).toFixed(1),
      },
    })
  } catch (error) {
    console.error("Error fetching seller dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
