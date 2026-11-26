import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["CANDIDATE", "HR", "COMPANY_ADMIN", "PLATFORM_ADMIN"],
      required: true,
    },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    headline: String,
    location: String,
    bio: String,
    skills: [String],
    avatarUrl: String,
    savedJobIds: [{ type: Schema.Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", UserSchema);
