import mongoose, { type Document, Schema } from "mongoose"

export interface ISellerShop extends Document {
  sellerId: mongoose.Types.ObjectId
  shopName: string
  shopDescription: string
  logo?: string
  banner?: string
  isActive: boolean
  products: mongoose.Types.ObjectId[]
  customization: {
    primaryColor?: string
    secondaryColor?: string
    theme?: "light" | "dark"
  }
  analytics: {
    totalVisits: number
    totalOrders: number
    totalRevenue: number
  }
  createdAt: Date
  updatedAt: Date
}

const SellerShopSchema = new Schema<ISellerShop>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    shopDescription: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    logo: {
      type: String,
    },
    banner: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    customization: {
      primaryColor: {
        type: String,
        default: "#3B82F6",
      },
      secondaryColor: {
        type: String,
        default: "#1F2937",
      },
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
    },
    analytics: {
      totalVisits: {
        type: Number,
        default: 0,
      },
      totalOrders: {
        type: Number,
        default: 0,
      },
      totalRevenue: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
SellerShopSchema.index({ sellerId: 1 })
SellerShopSchema.index({ isActive: 1 })

export default mongoose.models.SellerShop || mongoose.model<ISellerShop>("SellerShop", SellerShopSchema)
