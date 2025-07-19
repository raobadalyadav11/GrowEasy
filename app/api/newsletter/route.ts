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
        // Reactivate subscription
        existingSubscriber.status = "active"
        existingSubscriber.subscribedAt = new Date()
        existingSubscriber.unsubscribedAt = undefined
        await existingSubscriber.save()
        return NextResponse.json({ message: "Successfully resubscribed to newsletter!" })
      }
      return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
    }

    // Create new subscription
    const newsletter = new Newsletter({ email })
    await newsletter.save()

    return NextResponse.json({ message: "Successfully subscribed to newsletter!" })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const subscriber = await Newsletter.findOne({ email })
    if (!subscriber) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 })
    }

    subscriber.status = "unsubscribed"
    subscriber.unsubscribedAt = new Date()
    await subscriber.save()

    return NextResponse.json({ message: "Successfully unsubscribed from newsletter!" })
  } catch (error) {
    console.error("Newsletter unsubscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
