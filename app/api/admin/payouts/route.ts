import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Wallet from "@/models/Wallet"

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

    const filter: any = { type: "payout" }
    if (status) filter.status = status

    const skip = (page - 1) * limit

    const [payouts, total] = await Promise.all([
      Wallet.find(filter).populate("userId", "profile email").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Wallet.countDocuments(filter),
    ])

    return NextResponse.json({
      payouts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching payouts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
