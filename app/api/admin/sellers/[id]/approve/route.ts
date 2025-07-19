import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const seller = await User.findByIdAndUpdate(params.id, { status: "approved" }, { new: true }).select("-password")

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Seller approved successfully",
      seller,
    })
  } catch (error) {
    console.error("Error approving seller:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
