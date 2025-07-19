import mongoose, { type Document, Schema } from "mongoose"

export interface IWalletTransaction {
  type: "credit" | "debit"
  amount: number
  description: string
  orderId?: mongoose.Types.ObjectId
  affiliateLinkId?: mongoose.Types.ObjectId
  payoutId?: string
  status: "pending" | "completed" | "failed"
  createdAt: Date
}

export interface IWallet extends Document {
  sellerId: mongoose.Types.ObjectId
  balance: number
  totalEarnings: number
  totalWithdrawn: number
  transactions: IWalletTransaction[]
  lastPayoutDate?: Date
  createdAt: Date
  updatedAt: Date
}

const WalletTransactionSchema = new Schema<IWalletTransaction>({
  type: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
  affiliateLinkId: {
    type: Schema.Types.ObjectId,
    ref: "AffiliateLink",
  },
  payoutId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const WalletSchema = new Schema<IWallet>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },
    transactions: [WalletTransactionSchema],
    lastPayoutDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
WalletSchema.index({ sellerId: 1 })
WalletSchema.index({ "transactions.createdAt": -1 })

export default mongoose.models.Wallet || mongoose.model<IWallet>("Wallet", WalletSchema)
