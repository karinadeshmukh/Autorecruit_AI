import mongoose, { Schema, models } from "mongoose";

const AiSettingsSchema = new Schema(
  {
    key: { type: String, default: "global", unique: true },
    provider: { type: String, default: "openrouter" },
    model: { type: String, default: "openrouter/auto" },
    fallbacks: [String],
    enabledProviders: { type: [String], default: ["openrouter", "gemini", "huggingface"] },
  },
  { timestamps: true }
);

export const AiSettings = models.AiSettings || mongoose.model("AiSettings", AiSettingsSchema);
