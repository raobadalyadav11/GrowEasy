import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import AffiliateLink from "@/models/AffiliateLink"
import ProductEnquiry from "@/models/ProductEnquiry"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get approved enquiries for this seller
    const approvedEnquiries = await ProductEnquiry.find({
      sellerId: user.userId,
      status: "approved",
      approvedProductId: { $exists: true },
    })

    const productIds = approvedEnquiries.map((e) => e.approvedProductId).filter(Boolean)

    // Get affiliate links for seller's products
    const affiliateLinks = await AffiliateLink.find({
      sellerId: user.userId,
    }).populate("productId")

    // Calculate stats
    const totalProducts = productIds.length
    const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0)
    const totalConversions = affiliateLinks.reduce((sum, link) => sum + link.conversions, 0)
    const totalEarnings = affiliateLinks.reduce((sum, link) => sum + link.earnings, 0)
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

    return NextResponse.json({
      stats: {
        totalProducts,
        totalClicks,
        totalConversions,
        totalEarnings,
        conversionRate,
      },
    })
  } catch (error) {
    console.error("Error fetching shop stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
