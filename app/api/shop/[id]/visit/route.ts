import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import SellerShop from "@/models/SellerShop"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    await SellerShop.findByIdAndUpdate(params.id, {
      $inc: { "analytics.totalVisits": 1 },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating visit count:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
