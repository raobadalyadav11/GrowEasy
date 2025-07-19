import mongoose, { type Document, Schema } from "mongoose"

export interface IProductEnquiry extends Document {
  sellerId: mongoose.Types.ObjectId
  productName: string
  description: string
  category: string
  subcategory?: string
  suggestedPrice: number
  images: string[]
  specifications?: Record<string, any>
  status: "pending" | "approved" | "rejected"
  adminFeedback?: string
  approvedProductId?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ProductEnquirySchema = new Schema<IProductEnquiry>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    suggestedPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    specifications: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminFeedback: {
      type: String,
      trim: true,
    },
    approvedProductId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
ProductEnquirySchema.index({ sellerId: 1, status: 1 })
ProductEnquirySchema.index({ createdAt: -1 })

export default mongoose.models.ProductEnquiry || mongoose.model<IProductEnquiry>("ProductEnquiry", ProductEnquirySchema)
