import mongoose, { Schema, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: "Resume" },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    stage: {
      type: String,
      enum: [
        "applied",
        "screened",
        "assessment",
        "shortlisted",
        "interview",
        "offer",
        "hired",
        "rejected",
      ],
      default: "applied",
    },
    screeningAnswers: [{ question: String, answer: String }],
    matchScore: Number,
    matchReport: Schema.Types.Mixed,
    quizScore: Number,
    quizAttemptId: { type: Schema.Types.ObjectId, ref: "QuizAttempt" },
    stageHistory: [
      {
        stage: String,
        at: Date,
        by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export const Application = models.Application || mongoose.model("Application", ApplicationSchema);
