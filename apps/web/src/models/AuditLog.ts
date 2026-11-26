import mongoose, { Schema, models } from "mongoose";

const AuditLogSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    action: String,
    entity: String,
    entityId: String,
    meta: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const AuditLog = models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
