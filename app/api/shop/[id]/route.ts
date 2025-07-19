import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import SellerShop from "@/models/SellerShop"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const shop = await SellerShop.findById(params.id).populate("sellerId", "profile email").select("-__v")

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 })
    }

    return NextResponse.json({ shop })
  } catch (error) {
    console.error("Error fetching shop:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
