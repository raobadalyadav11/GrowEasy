import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
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
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const type = searchParams.get("type")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    const filter: any = { userId: user.userId }
    if (type) filter.type = type
    if (unreadOnly) filter.isRead = false

    const skip = (page - 1) * limit

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId: user.userId, isRead: false }),
    ])

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { notificationId, markAllAsRead } = await request.json()

    if (markAllAsRead) {
      await Notification.updateMany({ userId: user.userId, isRead: false }, { $set: { isRead: true } })
      return NextResponse.json({ message: "All notifications marked as read" })
    }

    if (notificationId) {
      await Notification.findOneAndUpdate({ _id: notificationId, userId: user.userId }, { $set: { isRead: true } })
      return NextResponse.json({ message: "Notification marked as read" })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Error updating notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
