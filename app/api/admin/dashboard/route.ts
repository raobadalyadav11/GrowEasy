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

    const [totalUsers, totalSellers, pendingSellers, totalProducts, totalOrders, recentOrders, recentSellers] =
      await Promise.all([
        User.countDocuments({ role: "customer" }),
        User.countDocuments({ role: "seller" }),
        User.countDocuments({ role: "seller", status: "pending" }),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.find()
          .populate("customerId", "profile.firstName profile.lastName email")
          .populate("items.productId", "name price")
          .sort({ createdAt: -1 })
          .limit(5),
        User.find({ role: "seller" }).select("-password").sort({ createdAt: -1 }).limit(5),
      ])

    const totalRevenue = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ])

    return NextResponse.json({
      totalUsers,
      totalSellers,
      pendingSellers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      recentSellers,
    })
  } catch (error) {
    console.error("Error fetching admin dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
