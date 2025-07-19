import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import ProductEnquiry from "@/models/ProductEnquiry"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "createdAt"
    const status = searchParams.get("status") || "active"

    // Build filter
    const filter: any = {
      status: status,
      sellerId: { $exists: false }, // Only admin-added products (no sellerId)
    }

    if (category) filter.category = category
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    // Build sort
    let sortObj: any = {}
    switch (sort) {
      case "name":
        sortObj = { name: 1 }
        break
      case "price":
        sortObj = { price: 1 }
        break
      case "affiliatePercentage":
        sortObj = { affiliatePercentage: -1 }
        break
      default:
        sortObj = { createdAt: -1 }
    }

    const skip = (page - 1) * limit

    // Get products that seller hasn't already enquired about
    const existingEnquiries = await ProductEnquiry.find({
      sellerId: user.userId,
    }).select("productId")

    const enquiredProductIds = existingEnquiries.map((e) => e.productId?.toString()).filter(Boolean)

    // Exclude products that seller has already enquired about
    if (enquiredProductIds.length > 0) {
      filter._id = { $nin: enquiredProductIds }
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(limit).select("-__v"),
      Product.countDocuments(filter),
    ])

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
    console.error("Error fetching available products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
