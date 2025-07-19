import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import ProductEnquiry from "@/models/ProductEnquiry"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get approved enquiries for this seller
    const approvedEnquiries = await ProductEnquiry.find({
      sellerId: user.userId,
      status: "approved",
      approvedProductId: { $exists: true },
    })

    // Get the actual products
    const productIds = approvedEnquiries.map((e) => e.approvedProductId).filter(Boolean)
    const products = await Product.find({
      _id: { $in: productIds },
      status: "active",
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching seller products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
