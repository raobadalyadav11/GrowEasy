import mongoose, { type Document, Schema } from "mongoose"

export interface IOrder extends Document {
  orderNumber: string
  customerId: mongoose.Types.ObjectId
  sellerId: mongoose.Types.ObjectId
  items: {
    productId: mongoose.Types.ObjectId
    name: string
    price: number
    quantity: number
    affiliatePercentage: number
  }[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  affiliateLinkId?: mongoose.Types.ObjectId
  couponCode?: string
  paymentDetails: {
    razorpayOrderId: string
    razorpayPaymentId?: string
    paymentMethod: string
    paymentStatus: "pending" | "completed" | "failed" | "refunded"
  }
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        affiliatePercentage: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    affiliateLinkId: {
      type: Schema.Types.ObjectId,
      ref: "AffiliateLink",
    },
    couponCode: {
      type: String,
      trim: true,
    },
    paymentDetails: {
      razorpayOrderId: {
        type: String,
        required: true,
      },
      razorpayPaymentId: String,
      paymentMethod: {
        type: String,
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
    },
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    billingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    trackingNumber: String,
    notes: String,
  },
  {
    timestamps: true,
  },
)

// Indexes
OrderSchema.index({ customerId: 1, createdAt: -1 })
OrderSchema.index({ sellerId: 1, createdAt: -1 })
OrderSchema.index({ orderNumber: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ "paymentDetails.paymentStatus": 1 })

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
