import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import Product from "@/models/Product"
import Order from "@/models/Order"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get statistics
    const [totalUsers, totalSellers, pendingSellers, totalProducts, totalOrders, recentOrders, recentSellers] =
      await Promise.all([
        User.countDocuments({ role: "customer" }),
        User.countDocuments({ role: "seller", status: "approved" }),
        User.countDocuments({ role: "seller", status: "pending" }),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.find().populate("customerId", "profile email").sort({ createdAt: -1 }).limit(5),
        User.find({ role: "seller" }).sort({ createdAt: -1 }).limit(5),
      ])

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ])
    const totalRevenue = revenueResult[0]?.total || 0

    return NextResponse.json({
      totalUsers,
      totalSellers,
      pendingSellers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      recentSellers,
    })
  } catch (error) {
    console.error("Error fetching admin dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
