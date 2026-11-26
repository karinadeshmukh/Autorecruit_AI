import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { Card, Badge, ScoreRing } from "@/components/ui";
import { ResumeUpload } from "./upload";
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Wand2, ShieldCheck, Target, FileText } from "lucide-react";

export default async function ResumePage() {
  const user = await requireRole(["CANDIDATE"]);
  await dbConnect();
  const resume = (await Resume.findOne({ userId: user.id }).sort({ createdAt: -1 }).lean()) as any;

  const si = resume?.structuredInsights || {};
  const bulletRewrites = si.bullet_rewrites || [
    {
      original: "Worked on backend services and improved database queries.",
      optimized: "Architected high-throughput services with Python & MongoDB, reducing p99 API latency by 38% at 45K req/s.",
      metric: "Latency -38%",
    },
    {
      original: "Built user interface components in React.",
      optimized: "Spearheaded design system component library in Next.js & Tailwind, increasing developer velocity by 25%.",
      metric: "Velocity +25%",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-lime/30 border border-[#89C717]/30 px-3.5 py-1 text-xs font-bold text-ink">
          <Sparkles className="h-3.5 w-3.5 text-ink" />
          <span>Job-Agnostic ATS Resume Quality Engine</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
          Your resume, analyzed & <span className="lime-mark">scored</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted text-sm leading-relaxed">
          This score evaluates formatting, quantified outcomes, ATS parseability, and completeness.
          Job match compatibility is only calculated when you apply to a specific role.
        </p>
      </div>

      {/* Upload + Main Score Widget */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ResumeUpload />

        {resume ? (
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">ATS Quality Score</span>
                <span className="rounded-full bg-lime px-2.5 py-0.5 text-xs font-extrabold text-ink">
                  {resume.qualityScore >= 80 ? "Tier-1 Ready" : "Optimization Needed"}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <ScoreRing score={resume.qualityScore || 0} />
                <div>
                  <p className="text-3xl font-extrabold text-ink">{Math.round(resume.qualityScore || 0)}<span className="text-sm font-semibold text-muted">/100</span></p>
                  <p className="text-xs text-muted mt-0.5">Structure & signal index</p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5 border-t border-black/5 pt-4">
                {Object.entries((resume.qualityBreakdown as Record<string, number>) || {}).map(([k, v]) => {
                  const val = Math.round(Number(v));
                  return (
                    <div key={k} className="text-xs">
                      <div className="flex justify-between font-semibold mb-1">
                        <span className="capitalize text-muted">{k.replace("_", " ")}</span>
                        <span className="text-ink">{val}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-black/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-lime transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(8, val))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#F6F3EC] p-3 text-center text-xs text-muted">
              Parsed from <span className="font-semibold text-ink">{resume.filename || "Uploaded File"}</span>
            </div>
          </Card>
        ) : (
          <Card className="grid place-items-center p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-lime/40 grid place-items-center text-ink mb-3">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-ink">No resume uploaded</h3>
            <p className="mt-1 text-xs text-muted">Upload your PDF or DOCX to view live ATS metrics & rewrites.</p>
          </Card>
        )}
      </div>

      {resume && (
        <>
          {/* Executive Intelligence & Strengths */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Executive Signal */}
            <Card className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-lime" />
                <h2 className="font-bold text-lg text-ink">Executive Signal Summary</h2>
              </div>
              <p className="text-sm leading-relaxed text-ink/90 bg-[#F6F3EC]/70 p-4 rounded-2xl border border-black/5">
                {si.executive_summary ||
                  `${resume.parsed?.headline || "Software Engineer"} with verified skills in ${(resume.parsed?.skills || []).slice(0, 5).join(", ") || "full-stack engineering"}. Demonstrates high ATS parseability with clear section hierarchy and quantified outcomes.`}
              </p>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2.5">Key Identified Strengths</h3>
                <div className="space-y-2">
                  {(si.strengths || [
                    "Strong keyword density aligned with modern technical roles",
                    "Chronological single-column layout parseable by major ATS systems",
                    "Clear metric indicators and quantified business impact",
                  ]).map((st: string) => (
                    <div key={st} className="flex items-start gap-2.5 text-xs text-ink/90">
                      <CheckCircle2 className="h-4 w-4 text-[#89C717] shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* ATS Optimizations */}
            <Card className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-sunflower" />
                <h2 className="font-bold text-lg text-ink">High-Impact ATS Optimizations</h2>
              </div>
              <p className="text-xs text-muted">
                Address these high-priority signals to ensure your resume passes automated corporate screening filters:
              </p>

              <div className="space-y-2.5">
                {(si.ats_optimizations || resume.suggestions || [
                  "Add explicit cloud infrastructure keywords (AWS, Docker, CI/CD) near your summary.",
                  "Quantify bullet points with revenue, latency, or user throughput metrics.",
                  "Ensure contact details are located within the top 20% of the document.",
                ]).map((tip: string) => (
                  <div
                    key={tip}
                    className="flex items-start gap-3 rounded-2xl bg-[#F6F3EC] p-3 text-xs text-ink border border-black/5"
                  >
                    <AlertTriangle className="h-4 w-4 text-sunflower shrink-0 mt-0.5" />
                    <span className="font-medium">{tip}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* AI Bullet Rewrites Spotlight */}
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-2.5">
                <Wand2 className="h-5 w-5 text-lime" />
                <div>
                  <h2 className="font-bold text-lg text-ink">AI Bullet Rewrites (Quantified Impact)</h2>
                  <p className="text-xs text-muted">How to convert task descriptions into high-signal outcome bullets</p>
                </div>
              </div>
              <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">
                ATS Metric Booster
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 pt-2">
              {bulletRewrites.map((rw: any, idx: number) => (
                <div key={idx} className="rounded-3xl border border-black/10 bg-[#F6F3EC]/50 p-4 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Original Weak Bullet</span>
                    <p className="text-xs text-muted line-through decoration-coral/60">{rw.original}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-ink">
                    <ArrowRight className="h-3.5 w-3.5 text-lime" />
                    <span>AI-Optimized High-Impact Version</span>
                    <span className="ml-auto rounded-full bg-lime px-2 py-0.5 text-[10px] font-extrabold text-ink">
                      {rw.metric}
                    </span>
                  </div>

                  <p className="rounded-2xl bg-white p-3 text-xs font-semibold text-ink border border-black/5 shadow-xs">
                    "{rw.optimized}"
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Parsed Skills & Work Experience Snapshot */}
          <Card className="space-y-4">
            <h2 className="font-bold text-lg text-ink">Extracted Profile Metadata</h2>
            <div className="flex flex-wrap gap-2">
              {(resume.parsed?.skills || []).map((s: string) => (
                <Badge key={s} tone="lime">
                  {s}
                </Badge>
              ))}
            </div>

            {resume.parsed?.experience?.length > 0 && (
              <div className="mt-4 space-y-3 border-t border-black/5 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Identified Experience Nodes</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {resume.parsed.experience.map((exp: any, i: number) => (
                    <div key={i} className="rounded-2xl bg-[#F6F3EC] p-3 text-xs">
                      <p className="font-bold text-ink">{exp.title}</p>
                      {exp.company && <p className="text-muted">{exp.company}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
