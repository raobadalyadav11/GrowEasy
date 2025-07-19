import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export default razorpay

export const createOrder = async (amount: number, currency = "INR", receipt?: string) => {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
    })
    return order
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    throw error
  }
}

export const verifyPayment = (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {
  const crypto = require("crypto")
  const body = razorpayOrderId + "|" + razorpayPaymentId
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest("hex")

  return expectedSignature === razorpaySignature
}

export const createPayout = async (accountNumber: string, ifsc: string, amount: number, purpose = "payout") => {
  try {
    const payout = await razorpay.payouts.create({
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER!,
      fund_account: {
        account_type: "bank_account",
        bank_account: {
          name: "Seller Payout",
          ifsc,
          account_number: accountNumber,
        },
      },
      amount: amount * 100, // Amount in paise
      currency: "INR",
      mode: "IMPS",
      purpose,
    })
    return payout
  } catch (error) {
    console.error("Error creating payout:", error)
    throw error
  }
}
