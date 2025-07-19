import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Feedback from "@/models/Feedback"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, email, rating, subject, message, category } = await request.json()

    if (!name || !email || !rating || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const feedback = new Feedback({
      name,
      email,
      rating,
      subject,
      message,
      category: category || "other",
    })

    await feedback.save()

    return NextResponse.json({ message: "Thank you for your feedback!" })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const category = searchParams.get("category")

    const query: any = {}
    if (status) query.status = status
    if (category) query.category = category

    const skip = (page - 1) * limit

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "profile.firstName profile.lastName email")

    const total = await Feedback.countDocuments(query)

    return NextResponse.json({
      feedbacks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get feedback error:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}
