import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import { createOrder } from "@/lib/razorpay"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { shopId, items, totalAmount } = await request.json()

    // Create Razorpay order
    const razorpayOrder = await createOrder(totalAmount, "INR")

    // Create order in database
    const order = new Order({
      shopId,
      items,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
      razorpayOrderId: razorpayOrder.id,
    })

    await order.save()

    return NextResponse.json({
      orderId: order._id,
      order: razorpayOrder,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
