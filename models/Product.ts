import mongoose, { type Document, Schema } from "mongoose"

export interface IProduct extends Document {
  name: string
  description: string
  shortDescription: string
  price: number
  comparePrice?: number
  stock: number
  sku: string
  category: string
  subcategory?: string
  tags: string[]
  images: string[]
  specifications: Record<string, any>
  affiliatePercentage: number
  sellerId?: mongoose.Types.ObjectId
  status: "pending" | "approved" | "rejected" | "active" | "inactive"
  featured: boolean
  seoTitle?: string
  seoDescription?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    comparePrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    specifications: {
      type: Schema.Types.Mixed,
      default: {},
    },
    affiliatePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
      default: 5,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "inactive"],
      default: "pending",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seoTitle: {
      type: String,
      maxlength: 60,
    },
    seoDescription: {
      type: String,
      maxlength: 160,
    },
    weight: {
      type: Number,
      min: 0,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
ProductSchema.index({ name: "text", description: "text", tags: "text" })
ProductSchema.index({ category: 1, subcategory: 1 })
ProductSchema.index({ sellerId: 1, status: 1 })
ProductSchema.index({ featured: 1, status: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ createdAt: -1 })

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
