import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Wallet from "@/models/Wallet"
import User from "@/models/User" // Declare the User variable

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    let wallet = await Wallet.findOne({ sellerId: user.userId })

    if (!wallet) {
      wallet = new Wallet({
        sellerId: user.userId,
        balance: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        transactions: [],
      })
      await wallet.save()
    }

    return NextResponse.json({ wallet })
  } catch (error) {
    console.error("Error fetching wallet:", error)
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

    const { bankDetails } = await request.json()

    // Update user's bank details
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { $set: { bankDetails } },
      { new: true, select: "bankDetails" },
    )

    return NextResponse.json({
      message: "Bank details updated successfully",
      bankDetails: updatedUser.bankDetails,
    })
  } catch (error) {
    console.error("Error updating bank details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
