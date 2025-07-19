import mongoose, { type Document, Schema } from "mongoose"

export interface IFeedback extends Document {
  name: string
  email: string
  rating: number
  message: string
  status: "pending" | "reviewed" | "responded"
  response?: string
  respondedBy?: mongoose.Types.ObjectId
  respondedAt?: Date
  createdAt: Date
}

const FeedbackSchema = new Schema<IFeedback>(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "responded"],
      default: "pending",
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

export default mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema)
