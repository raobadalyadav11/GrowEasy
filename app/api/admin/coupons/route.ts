import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Coupon from "@/models/Coupon"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const filter: any = {}
    if (status) {
      if (status === "active") {
        filter.isActive = true
        filter.expiryDate = { $gte: new Date() }
      } else if (status === "expired") {
        filter.$or = [{ isActive: false }, { expiryDate: { $lt: new Date() } }]
      }
    }
    if (search) {
      filter.code = { $regex: search, $options: "i" }
    }

    const skip = (page - 1) * limit

    const [coupons, total] = await Promise.all([
      Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Coupon.countDocuments(filter),
    ])

    return NextResponse.json({
      coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const couponData = await request.json()

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: couponData.code })
    if (existingCoupon) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 })
    }

    const coupon = new Coupon(couponData)
    await coupon.save()

    return NextResponse.json({
      message: "Coupon created successfully",
      coupon,
    })
  } catch (error) {
    console.error("Error creating coupon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
