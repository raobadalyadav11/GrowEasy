import mongoose, { type Document, Schema } from "mongoose"

export interface ICoupon extends Document {
  code: string
  name: string
  description?: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minimumOrderAmount?: number
  maximumDiscountAmount?: number
  usageLimit?: number
  usedCount: number
  userUsageLimit?: number
  validFrom: Date
  validUntil: Date
  isActive: boolean
  applicableProducts?: mongoose.Types.ObjectId[]
  applicableCategories?: string[]
  excludedProducts?: mongoose.Types.ObjectId[]
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 20,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumOrderAmount: {
      type: Number,
      min: 0,
    },
    maximumDiscountAmount: {
      type: Number,
      min: 0,
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    userUsageLimit: {
      type: Number,
      min: 1,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    applicableCategories: [
      {
        type: String,
        trim: true,
      },
    ],
    excludedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
CouponSchema.index({ code: 1 })
CouponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 })
CouponSchema.index({ createdBy: 1 })

export default mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema)
