import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import SellerShop from "@/models/SellerShop"
import { verifyPayment } from "@/lib/razorpay"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json()

    // Verify payment signature
    const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Update order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "completed",
        status: "confirmed",
        razorpayPaymentId: razorpay_payment_id,
        paidAt: new Date(),
      },
      { new: true },
    )

    if (order) {
      // Update shop analytics
      await SellerShop.findByIdAndUpdate(order.shopId, {
        $inc: {
          "analytics.totalOrders": 1,
          "analytics.totalRevenue": order.totalAmount,
        },
      })
    }

    return NextResponse.json({
      message: "Payment verified successfully",
      order,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
