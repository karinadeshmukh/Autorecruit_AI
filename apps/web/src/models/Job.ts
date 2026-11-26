import mongoose, { Schema, models } from "mongoose";

const JobSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: String,
    jobType: { type: String, default: "Full-time" },
    experienceLevel: { type: String, default: "Intermediate" },
    remote: { type: Boolean, default: false },
    salaryMin: Number,
    salaryMax: Number,
    skills: [String],
    eligibility: {
      education: String,
      minYears: Number,
      location: String,
    },
    screeningQuestions: [{ prompt: String, required: { type: Boolean, default: true } }],
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
    weights: {
      keywords: { type: Number, default: 0.3 },
      semantic: { type: Number, default: 0.4 },
      eligibility: { type: Number, default: 0.2 },
      extras: { type: Number, default: 0.1 },
    },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

export const Job = models.Job || mongoose.model("Job", JobSchema);
