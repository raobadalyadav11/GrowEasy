import mongoose, { type Document, Schema } from "mongoose"

export interface INotification extends Document {
  title: string
  message: string
  type: "email" | "sms" | "push"
  recipients: Array<{
    userId: mongoose.Types.ObjectId
    email?: string
    phone?: string
    status: "pending" | "sent" | "failed"
    sentAt?: Date
    error?: string
  }>
  template?: string
  scheduledAt?: Date
  sentBy: mongoose.Types.ObjectId
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["email", "sms", "push"],
      required: true,
    },
    recipients: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        email: String,
        phone: String,
        status: {
          type: String,
          enum: ["pending", "sent", "failed"],
          default: "pending",
        },
        sentAt: Date,
        error: String,
      },
    ],
    template: String,
    scheduledAt: Date,
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)
