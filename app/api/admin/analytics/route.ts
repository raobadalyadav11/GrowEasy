import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import Product from "@/models/Product"
import Order from "@/models/Order"
import Coupon from "@/models/Coupon"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Sales analytics
    const [totalSales, monthlySales, weeklySales, dailySales] = await Promise.all([
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { status: "delivered", createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { status: "delivered", createdAt: { $gte: startOfWeek } } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { status: "delivered", createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
    ])

    // User analytics
    const [totalUsers, newUsersThisMonth, usersByRole] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    ])

    // Product analytics
    const [totalProducts, productsByCategory, topProducts] = await Promise.all([
      Product.countDocuments(),
      Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
      Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
      ]),
    ])

    // Coupon analytics
    const [totalCoupons, activeCoupons, couponUsage] = await Promise.all([
      Coupon.countDocuments(),
      Coupon.countDocuments({ isActive: true, expiryDate: { $gte: new Date() } }),
      Coupon.aggregate([{ $group: { _id: null, totalUsed: { $sum: "$usedCount" } } }]),
    ])

    return NextResponse.json({
      sales: {
        total: totalSales[0]?.total || 0,
        totalOrders: totalSales[0]?.count || 0,
        monthly: monthlySales[0]?.total || 0,
        monthlyOrders: monthlySales[0]?.count || 0,
        weekly: weeklySales[0]?.total || 0,
        weeklyOrders: weeklySales[0]?.count || 0,
        daily: dailySales[0]?.total || 0,
        dailyOrders: dailySales[0]?.count || 0,
      },
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        byRole: usersByRole,
      },
      products: {
        total: totalProducts,
        byCategory: productsByCategory,
        topSelling: topProducts,
      },
      coupons: {
        total: totalCoupons,
        active: activeCoupons,
        totalUsed: couponUsage[0]?.totalUsed || 0,
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
