import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return current environment variables and settings
    const settings = {
      general: {
        siteName: process.env.SITE_NAME || "GrowEasy",
        siteDescription: process.env.SITE_DESCRIPTION || "Modern Multi-Vendor E-commerce Platform",
        siteUrl: process.env.SITE_URL || "https://groweasy.com",
        adminEmail: process.env.ADMIN_EMAIL || "admin@groweasy.com",
        supportEmail: process.env.SUPPORT_EMAIL || "support@groweasy.com",
        currency: process.env.CURRENCY || "INR",
        timezone: process.env.TIMEZONE || "Asia/Kolkata",
        language: process.env.LANGUAGE || "en",
      },
      payment: {
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
        razorpayKeySecret: "***hidden***",
        razorpayAccountNumber: process.env.RAZORPAY_ACCOUNT_NUMBER || "",
        paymentMethods: ["card", "netbanking", "upi", "wallet"],
        minimumPayoutAmount: Number(process.env.MINIMUM_PAYOUT_AMOUNT) || 100,
        payoutSchedule: process.env.PAYOUT_SCHEDULE || "weekly",
      },
      features: {
        allowSellerRegistration: process.env.ALLOW_SELLER_REGISTRATION !== "false",
        requireSellerApproval: process.env.REQUIRE_SELLER_APPROVAL !== "false",
        enableAffiliateProgram: process.env.ENABLE_AFFILIATE_PROGRAM !== "false",
        enableCoupons: process.env.ENABLE_COUPONS !== "false",
        enableReviews: process.env.ENABLE_REVIEWS !== "false",
        enableWishlist: process.env.ENABLE_WISHLIST !== "false",
      },
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching admin settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await request.json()

    // In a real application, you would save these settings to a database
    // For now, we'll just return success
    console.log("Admin settings updated:", settings)

    return NextResponse.json({
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("Error updating admin settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
