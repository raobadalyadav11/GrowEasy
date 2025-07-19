import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import Wallet from "@/models/Wallet"
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth"
import { validateEmail, validatePhone } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, password, firstName, lastName, phone, role, businessInfo, bankDetails } = body

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    if (phone && !validatePhone(phone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const userData: any = {
      email,
      password: hashedPassword,
      role: role || "customer",
      status: role === "seller" ? "pending" : "active",
      profile: {
        firstName,
        lastName,
        phone,
      },
    }

    if (role === "seller" && businessInfo) {
      userData.businessInfo = businessInfo
      userData.bankDetails = bankDetails
    }

    const user = new User(userData)
    await user.save()

    // Create wallet for sellers
    if (role === "seller") {
      const wallet = new Wallet({
        sellerId: user._id,
        balance: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        transactions: [],
      })
      await wallet.save()
    }

    // Create JWT token
    const token = await createToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    })

    // Set cookie
    await setAuthCookie(token)

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
