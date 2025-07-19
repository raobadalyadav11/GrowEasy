import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import SellerShop from "@/models/SellerShop"
import Product from "@/models/Product"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const shop = await SellerShop.findById(params.id)
    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 })
    }

    const products = await Product.find({
      sellerId: shop.sellerId,
      status: "active",
    }).select("-__v")

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching shop products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
