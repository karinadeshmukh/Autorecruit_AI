export const APPLICATION_STAGES = [
  "applied",
  "screened",
  "assessment",
  "shortlisted",
  "interview",
  "offer",
  "hired",
  "rejected",
] as const;

export type ApplicationStage = (typeof APPLICATION_STAGES)[number];

export const USER_ROLES = [
  "CANDIDATE",
  "HR",
  "COMPANY_ADMIN",
  "PLATFORM_ADMIN",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Remote",
] as const;

export const EXPERIENCE_LEVELS = [
  "Entry",
  "Intermediate",
  "Expert",
] as const;

export const DEFAULT_ATS_WEIGHTS = {
  keywords: 0.3,
  semantic: 0.4,
  eligibility: 0.2,
  extras: 0.1,
} as const;
