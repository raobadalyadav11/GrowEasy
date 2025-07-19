import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Newsletter from "@/models/Newsletter"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email })
    if (existingSubscriber) {
      if (existingSubscriber.status === "unsubscribed") {
        existingSubscriber.status = "active"
        existingSubscriber.subscribedAt = new Date()
        await existingSubscriber.save()
        return NextResponse.json({ message: "Successfully resubscribed to newsletter!" })
      }
      return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
    }

    const subscriber = new Newsletter({ email })
    await subscriber.save()

    return NextResponse.json({ message: "Successfully subscribed to newsletter!" })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const subscriber = await Newsletter.findOne({ email })
    if (!subscriber) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 })
    }

    subscriber.status = "unsubscribed"
    await subscriber.save()

    return NextResponse.json({ message: "Successfully unsubscribed from newsletter!" })
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error)
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
  }
}
