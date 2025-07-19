import mongoose, { type Document, Schema } from "mongoose"

export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId
  action: string
  target: string
  targetId?: mongoose.Types.ObjectId
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    target: {
      type: String,
      required: true,
      trim: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
    },
    details: {
      type: Schema.Types.Mixed,
      required: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
AuditLogSchema.index({ adminId: 1, createdAt: -1 })
AuditLogSchema.index({ action: 1 })
AuditLogSchema.index({ target: 1 })

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema)
