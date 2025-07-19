import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const sellerData = await User.findById(user.userId).select("settings")

    return NextResponse.json({
      settings: sellerData?.settings || {
        businessInfo: {},
        bankDetails: {},
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          orderAlerts: true,
          paymentAlerts: true,
          enquiryAlerts: true,
        },
        preferences: {
          currency: "INR",
          timezone: "Asia/Kolkata",
          language: "en",
          autoApproveOrders: false,
          minimumOrderAmount: 0,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching seller settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const settings = await request.json()

    await User.findByIdAndUpdate(user.userId, {
      $set: { settings },
    })

    return NextResponse.json({
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("Error updating seller settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
