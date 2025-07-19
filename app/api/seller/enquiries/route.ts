import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import ProductEnquiry from "@/models/ProductEnquiry"
import Notification from "@/models/Notification"

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
    const search = searchParams.get("search")

    const filter: any = { sellerId: user.userId }
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit

    const [enquiries, total] = await Promise.all([
      ProductEnquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductEnquiry.countDocuments(filter),
    ])

    return NextResponse.json({
      enquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching enquiries:", error)
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

    const enquiryData = await request.json()
    const { productName, description, category, subcategory, suggestedPrice, images, specifications } = enquiryData

    if (!productName || !description || !category || !suggestedPrice) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    const enquiry = new ProductEnquiry({
      sellerId: user.userId,
      productName,
      description,
      category,
      subcategory,
      suggestedPrice,
      images: images || [],
      specifications: specifications || {},
    })

    await enquiry.save()

    // Create notification for admin
    const notification = new Notification({
      userId: user.userId,
      type: "enquiry",
      title: "Product Enquiry Submitted",
      message: `Your product enquiry for "${productName}" has been submitted for admin review.`,
      data: { enquiryId: enquiry._id },
    })
    await notification.save()

    return NextResponse.json(
      {
        message: "Product enquiry submitted successfully",
        enquiry,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating enquiry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
