import mongoose, { type Document, Schema } from "mongoose"

export interface IAffiliateLink extends Document {
  sellerId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
  linkId: string
  url: string
  clicks: number
  conversions: number
  earnings: number
  isActive: boolean
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const AffiliateLinkSchema = new Schema<IAffiliateLink>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    linkId: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    conversions: {
      type: Number,
      default: 0,
      min: 0,
    },
    earnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
AffiliateLinkSchema.index({ sellerId: 1, productId: 1 })
AffiliateLinkSchema.index({ linkId: 1 })
AffiliateLinkSchema.index({ isActive: 1 })

export default mongoose.models.AffiliateLink || mongoose.model<IAffiliateLink>("AffiliateLink", AffiliateLinkSchema)
