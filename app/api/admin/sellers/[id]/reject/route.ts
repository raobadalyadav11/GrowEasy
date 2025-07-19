import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const seller = await User.findByIdAndUpdate(params.id, { status: "rejected" }, { new: true }).select("-password")

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Seller rejected successfully",
      seller,
    })
  } catch (error) {
    console.error("Error rejecting seller:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
