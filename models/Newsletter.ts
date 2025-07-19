import mongoose from "mongoose"

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      default: "website",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema)
