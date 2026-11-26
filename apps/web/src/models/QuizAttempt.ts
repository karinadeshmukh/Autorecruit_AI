import mongoose, { Schema, models } from "mongoose";

const QuizAttemptSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    applicationId: { type: Schema.Types.ObjectId, ref: "Application" },
    candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answers: [{ questionIndex: Number, selectedIndex: Number, text: String }],
    score: Number,
    maxScore: Number,
    submittedAt: Date,
  },
  { timestamps: true }
);

export const QuizAttempt = models.QuizAttempt || mongoose.model("QuizAttempt", QuizAttemptSchema);
