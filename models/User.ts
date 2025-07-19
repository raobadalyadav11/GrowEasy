import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  email: string
  password: string
  role: "admin" | "seller" | "customer"
  status: "pending" | "approved" | "rejected" | "active"
  profile: {
    firstName: string
    lastName: string
    phone?: string
    avatar?: string
  }
  businessInfo?: {
    businessName: string
    businessType: string
    gstNumber?: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  bankDetails?: {
    accountNumber: string
    ifscCode: string
    accountHolderName: string
    bankName: string
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "seller", "customer"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active"],
      default: "active",
    },
    profile: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      avatar: {
        type: String,
      },
    },
    businessInfo: {
      businessName: String,
      businessType: String,
      gstNumber: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String,
      bankName: String,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1, status: 1 })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
