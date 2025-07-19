import mongoose, { type Document, Schema } from "mongoose"

export interface IContactMessage extends Document {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "new" | "read" | "responded"
  response?: string
  respondedBy?: mongoose.Types.ObjectId
  respondedAt?: Date
  createdAt: Date
}

const ContactMessageSchema = new Schema<IContactMessage>(
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
    },
    status: {
      type: String,
      enum: ["new", "read", "responded"],
      default: "new",
    },
    response: {
      type: String,
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.ContactMessage || mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema)
