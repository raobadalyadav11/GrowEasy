import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import Order from "@/models/Order"
import Wallet from "@/models/Wallet"
import AffiliateLink from "@/models/AffiliateLink"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const [totalProducts, pendingProducts, wallet, recentOrders, topProducts, affiliateStats] = await Promise.all([
      Product.countDocuments({ sellerId: user.userId }),
      Product.countDocuments({ sellerId: user.userId, status: "pending" }),
      Wallet.findOne({ sellerId: user.userId }),
      Order.find({ "items.sellerId": user.userId })
        .populate("customerId", "profile.firstName profile.lastName")
        .sort({ createdAt: -1 })
        .limit(10),
      Product.find({ sellerId: user.userId }).sort({ salesCount: -1 }).limit(5),
      AffiliateLink.aggregate([
        { $match: { sellerId: user.userId } },
        {
          $group: {
            _id: null,
            totalClicks: { $sum: "$clicks" },
            totalConversions: { $sum: "$conversions" },
          },
        },
      ]),
    ])

    const totalOrders = recentOrders.length
    const totalEarnings = wallet?.totalEarnings || 0
    const walletBalance = wallet?.balance || 0

    const affiliateData = affiliateStats[0] || { totalClicks: 0, totalConversions: 0 }
    const conversionRate =
      affiliateData.totalClicks > 0
        ? ((affiliateData.totalConversions / affiliateData.totalClicks) * 100).toFixed(2)
        : 0

    return NextResponse.json({
      totalProducts,
      pendingProducts,
      totalOrders,
      totalEarnings,
      walletBalance,
      recentOrders: recentOrders.slice(0, 5),
      topProducts,
      affiliateStats: {
        totalClicks: affiliateData.totalClicks,
        totalConversions: affiliateData.totalConversions,
        conversionRate: Number.parseFloat(conversionRate.toString()),
      },
    })
  } catch (error) {
    console.error("Error fetching seller dashboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
