import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import AffiliateLink from "@/models/AffiliateLink"
import Product from "@/models/Product"

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
    const productId = searchParams.get("productId")

    const filter: any = { sellerId: user.userId }
    if (productId) filter.productId = productId

    const skip = (page - 1) * limit

    const [links, total] = await Promise.all([
      AffiliateLink.find(filter)
        .populate("productId", "name price images category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AffiliateLink.countDocuments(filter),
    ])

    return NextResponse.json({
      links,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching affiliate links:", error)
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

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Check if product exists and is approved
    const product = await Product.findById(productId)
    if (!product || product.status !== "active") {
      return NextResponse.json({ error: "Product not found or not active" }, { status: 404 })
    }

    // Check if affiliate link already exists
    const existingLink = await AffiliateLink.findOne({
      sellerId: user.userId,
      productId,
    })

    if (existingLink) {
      return NextResponse.json({ error: "Affiliate link already exists for this product" }, { status: 400 })
    }

    // Generate unique affiliate code
    const affiliateCode = `${user.userId.toString().slice(-6)}-${productId.toString().slice(-6)}-${Date.now()
      .toString()
      .slice(-6)}`

    const affiliateLink = new AffiliateLink({
      sellerId: user.userId,
      productId,
      affiliateCode,
      commissionRate: product.affiliatePercentage,
    })

    await affiliateLink.save()

    const populatedLink = await AffiliateLink.findById(affiliateLink._id).populate(
      "productId",
      "name price images category",
    )

    return NextResponse.json(
      {
        message: "Affiliate link created successfully",
        link: populatedLink,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating affiliate link:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
