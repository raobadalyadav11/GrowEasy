import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const source = searchParams.get("source") // 'shop' or 'affiliate'

    const filter: any = { sellerId: user.userId }
    if (status) filter.status = status

    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("customerId", "profile email")
        .populate("items.productId", "name images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ])

    // Filter by source if specified
    let filteredOrders = orders
    if (source === "affiliate") {
      filteredOrders = orders.filter((order) => order.affiliateLinkId)
    } else if (source === "shop") {
      filteredOrders = orders.filter((order) => !order.affiliateLinkId)
    }

    return NextResponse.json({
      orders: filteredOrders,
      pagination: {
        page,
        limit,
        total: source ? filteredOrders.length : total,
        pages: Math.ceil((source ? filteredOrders.length : total) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
