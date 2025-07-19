import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import SupportTicket from "@/models/SupportTicket"
import { getCurrentUser } from "@/lib/auth"

function generateTicketNumber() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `TKT${timestamp}${random}`
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, subject, message, priority, category } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
    }

    const user = await getCurrentUser()

    const ticket = new SupportTicket({
      ticketNumber: generateTicketNumber(),
      userId: user?._id,
      name,
      email,
      subject,
      message,
      priority: priority || "medium",
      category: category || "general",
    })

    await ticket.save()

    return NextResponse.json({
      message: "Support ticket created successfully!",
      ticketNumber: ticket.ticketNumber,
    })
  } catch (error) {
    console.error("Support ticket creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const category = searchParams.get("category")

    const filter: any = {}
    if (status) filter.status = status
    if (priority) filter.priority = priority
    if (category) filter.category = category

    const skip = (page - 1) * limit

    const [tickets, total] = await Promise.all([
      SupportTicket.find(filter)
        .populate("userId", "profile.firstName profile.lastName email")
        .populate("assignedTo", "profile.firstName profile.lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SupportTicket.countDocuments(filter),
    ])

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching support tickets:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
