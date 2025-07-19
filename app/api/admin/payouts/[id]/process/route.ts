import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Wallet from "@/models/Wallet"
import { createPayout } from "@/lib/razorpay"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const payout = await Wallet.findById(params.id)
    if (!payout || payout.status !== "pending") {
      return NextResponse.json({ error: "Invalid payout request" }, { status: 400 })
    }

    try {
      // Process payout via Razorpay
      const razorpayPayout = await createPayout(
        payout.bankDetails.accountNumber,
        payout.bankDetails.ifscCode,
        payout.amount,
      )

      // Update payout status
      await Wallet.findByIdAndUpdate(params.id, {
        status: "completed",
        razorpayPayoutId: razorpayPayout.id,
        processedAt: new Date(),
      })

      return NextResponse.json({
        message: "Payout processed successfully",
      })
    } catch (payoutError) {
      // Update payout as failed
      await Wallet.findByIdAndUpdate(params.id, {
        status: "failed",
        failureReason: payoutError.message,
        processedAt: new Date(),
      })

      throw payoutError
    }
  } catch (error) {
    console.error("Error processing payout:", error)
    return NextResponse.json({ error: "Failed to process payout" }, { status: 500 })
  }
}
