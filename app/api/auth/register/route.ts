import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import Wallet from "@/models/Wallet"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { firstName, lastName, email, password, phone, role, businessInfo, bankDetails, documents } = data

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user data
    const userData: any = {
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "customer",
      status: role === "seller" ? "pending" : "active",
      profile: {
        firstName,
        lastName,
        phone,
      },
    }

    // Add seller-specific data
    if (role === "seller") {
      userData.businessInfo = businessInfo
      userData.bankDetails = bankDetails
      userData.documents = documents
    }

    const user = new User(userData)
    await user.save()

    // For customers and admins, log them in immediately
    if (role !== "seller") {
      const token = await generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      })

      const cookieStore = cookies()
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })
    } else {
      // Create wallet for sellers
      const wallet = new Wallet({
        sellerId: user._id,
        balance: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        transactions: [],
      })
      await wallet.save()
    }

    return NextResponse.json(
      {
        message: role === "seller" ? "Registration successful. Awaiting approval." : "Registration successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
          profile: user.profile,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
