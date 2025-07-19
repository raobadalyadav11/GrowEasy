import mongoose, { type Document, Schema } from "mongoose"

export interface ISupportTicket extends Document {
  ticketNumber: string
  userId?: mongoose.Types.ObjectId
  name: string
  email: string
  subject: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  category: "technical" | "billing" | "general" | "product" | "account"
  assignedTo?: mongoose.Types.ObjectId
  responses: Array<{
    message: string
    respondedBy: mongoose.Types.ObjectId
    respondedAt: Date
    isAdmin: boolean
  }>
  resolvedAt?: Date
  createdAt: Date
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
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
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    category: {
      type: String,
      enum: ["technical", "billing", "general", "product", "account"],
      default: "general",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    responses: [
      {
        message: String,
        respondedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        respondedAt: {
          type: Date,
          default: Date.now,
        },
        isAdmin: {
          type: Boolean,
          default: false,
        },
      },
    ],
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.SupportTicket || mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema)
