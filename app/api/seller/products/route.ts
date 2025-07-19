import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import { getCurrentUser } from "@/lib/auth"

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

    const filter: any = { sellerId: user.userId }
    if (status) filter.status = status

    const skip = (page - 1) * limit

    const products = await Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Product.countDocuments(filter)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching seller products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const productData = await request.json()

    const product = new Product({
      ...productData,
      sellerId: user.userId,
      status: "pending",
    })

    await product.save()

    return NextResponse.json({
      message: "Product enquiry submitted successfully",
      product,
    })
  } catch (error) {
    console.error("Error creating product enquiry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
