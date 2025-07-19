import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ContactMessage from "@/models/ContactMessage"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, phone, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    })

    await contactMessage.save()

    return NextResponse.json({ message: "Message sent successfully! We'll get back to you soon." })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
