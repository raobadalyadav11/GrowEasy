import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Feedback from "@/models/Feedback"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, rating, message } = await request.json()

    if (!name || !email || !rating || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const feedback = new Feedback({
      name,
      email,
      rating,
      message,
    })

    await feedback.save()

    return NextResponse.json({ message: "Thank you for your feedback!" })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
