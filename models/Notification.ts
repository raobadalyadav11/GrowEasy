import mongoose, { type Document, Schema } from "mongoose"

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  type: "application" | "enquiry" | "order" | "payout" | "general"
  title: string
  message: string
  isRead: boolean
  data?: Record<string, any>
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["application", "enquiry", "order", "payout", "general"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
NotificationSchema.index({ userId: 1, isRead: 1 })
NotificationSchema.index({ createdAt: -1 })

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)
