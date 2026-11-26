import mongoose, { Schema, models } from "mongoose";

const QuizSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    timeLimitMinutes: { type: Number, default: 20 },
    questions: [
      {
        type: { type: String, enum: ["mcq", "short"], default: "mcq" },
        prompt: String,
        options: [String],
        correctIndex: Number,
        points: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export const Quiz = models.Quiz || mongoose.model("Quiz", QuizSchema);
