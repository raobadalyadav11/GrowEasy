import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import SupportTicket from "@/models/SupportTicket"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subject, description, category, priority, attachments } = await request.json()

    if (!subject || !description || !category) {
      return NextResponse.json({ error: "Subject, description, and category are required" }, { status: 400 })
    }

    // Generate ticket number
    const ticketNumber = `TKT${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`

    const ticket = new SupportTicket({
      ticketNumber,
      userId: user.id,
      subject,
      description,
      category,
      priority: priority || "medium",
      attachments: attachments || [],
      messages: [
        {
          sender: user.id,
          message: description,
          timestamp: new Date(),
        },
      ],
    })

    await ticket.save()

    return NextResponse.json({
      message: "Support ticket created successfully!",
      ticketNumber: ticket.ticketNumber,
    })
  } catch (error) {
    console.error("Create support ticket error:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    const query: any = {}
    if (user.role !== "admin") {
      query.userId = user.id
    }
    if (status) query.status = status

    const skip = (page - 1) * limit

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "profile.firstName profile.lastName email")
      .populate("assignedTo", "profile.firstName profile.lastName")

    const total = await SupportTicket.countDocuments(query)

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
    console.error("Get support tickets error:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}
