import mongoose, { Schema, models } from "mongoose";

const ResumeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    filename: String,
    mimeType: String,
    filePath: String,
    parsed: Schema.Types.Mixed,
    rawText: String,
    qualityScore: Number,
    qualityBreakdown: Schema.Types.Mixed,
    suggestions: [String],
    insights: [String],
    structuredInsights: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Resume = models.Resume || mongoose.model("Resume", ResumeSchema);
