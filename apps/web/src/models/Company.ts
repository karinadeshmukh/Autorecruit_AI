import mongoose, { Schema, models } from "mongoose";

const CompanySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    website: String,
    logoText: String,
    logoUrl: String,
    logoBg: { type: String, default: "#111111" },
    industry: { type: String, default: "Technology" },
    about: String,
    location: String,
  },
  { timestamps: true }
);

export const Company = models.Company || mongoose.model("Company", CompanySchema);
