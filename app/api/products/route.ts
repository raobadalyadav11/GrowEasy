import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const sort = searchParams.get("sort") || "createdAt"
    const search = searchParams.get("search")

    const filter: any = { status: "active" }
    if (category) filter.category = category
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    const skip = (page - 1) * limit

    let sortOption: any = { createdAt: -1 }
    if (sort === "name") sortOption = { name: 1 }
    else if (sort === "price") sortOption = { price: 1 }
    else if (sort === "affiliatePercentage") sortOption = { affiliatePercentage: -1 }

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limit).select("-__v"),
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
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
