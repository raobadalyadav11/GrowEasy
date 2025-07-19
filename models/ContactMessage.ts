import mongoose from "mongoose"

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["general", "support", "business", "partnership", "complaint", "other"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "resolved"],
      default: "new",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    adminResponse: {
      message: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      respondedAt: Date,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.ContactMessage || mongoose.model("ContactMessage", contactMessageSchema)
