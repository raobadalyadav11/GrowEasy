import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ContactMessage from "@/models/ContactMessage"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, email, phone, subject, message, category } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message,
      category: category || "general",
    })

    await contactMessage.save()

    return NextResponse.json({ message: "Message sent successfully! We'll get back to you soon." })
  } catch (error) {
    console.error("Contact message error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    const query = status ? { status } : {}
    const skip = (page - 1) * limit

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "profile.firstName profile.lastName email")

    const total = await ContactMessage.countDocuments(query)

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get contact messages error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
