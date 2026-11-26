import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";
import { Card, Badge, ScoreRing, Button } from "@/components/ui";
import { formatSalary } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StageButtons } from "./stage-buttons";
import { Filter, Users, Building2, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function JobApplicants({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ stage?: string }>;
}) {
  const user = await requireRole(["HR", "COMPANY_ADMIN"]);
  const { id } = await params;
  const sp = await searchParams;
  await dbConnect();

  const job = (await Job.findOne({ _id: id, companyId: user.companyId }).lean()) as any;
  if (!job) notFound();

  const query: Record<string, unknown> = {
    jobId: job._id,
    companyId: user.companyId,
  };
  if (sp.stage) query.stage = sp.stage;

  const [apps, allApps] = (await Promise.all([
    Application.find(query)
      .populate("candidateId", "name email headline location skills")
      .populate("resumeId", "qualityScore")
      .sort({ matchScore: -1 })
      .lean(),
    Application.find({ jobId: job._id, companyId: user.companyId }).select("stage matchScore").lean(),
  ])) as [any[], any[]];

  const stagesList = ["all", "applied", "screened", "assessment", "shortlisted", "interview", "offer", "hired", "rejected"];
  const stageCounts = Object.fromEntries(stagesList.map((s) => [s, s === "all" ? allApps.length : allApps.filter((a: any) => a.stage === s).length]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-lime/30 px-3 py-1 text-xs font-bold text-ink mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ranked by Semantic ATS Fit</span>
          </div>
          <h1 className="text-3xl font-extrabold text-ink">{job.title}</h1>
          <p className="text-sm text-muted mt-1">
            Job compatibility score uses TF-IDF + sentence embeddings. General resume quality score stays separate.
          </p>
        </div>
        <Button href={`/jobs/${job._id}`} target="_blank" variant="secondary" className="text-xs">
          View Public Post →
        </Button>
      </div>

      {/* Main Layout with Sticky Right Filter Sidebar */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px] items-start">
        {/* Left: Ranked Candidate List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Showing {apps.length} candidate{apps.length === 1 ? "" : "s"} {sp.stage ? `in ${sp.stage}` : ""}
            </span>
          </div>

          {apps.map((a: any, idx: number) => (
            <Card key={String(a._id)} className="flex flex-wrap items-center justify-between gap-4 !p-5 transition hover:border-black/20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ScoreRing score={a.matchScore || 0} />
                  <span className="absolute -top-1 -left-1 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] font-black text-white">
                    #{idx + 1}
                  </span>
                </div>
                <div>
                  <Link href={`/hr/applicants/${a._id}`} className="font-extrabold text-ink text-base hover:underline flex items-center gap-1.5">
                    {a.candidateId?.name}
                  </Link>
                  <p className="text-xs text-muted font-medium">{a.candidateId?.headline || a.candidateId?.email}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
                    <span className="font-bold text-ink">Match {Math.round(a.matchScore || 0)}%</span>
                    <span>•</span>
                    <span>Quality {Math.round(a.resumeId?.qualityScore || 0)}/100</span>
                    {a.quizScore != null && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-[#89C717]">Quiz {a.quizScore}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge tone={a.stage === "hired" ? "lime" : a.stage === "rejected" ? "coral" : "ink"}>
                  {a.stage}
                </Badge>
                <StageButtons id={String(a._id)} />
              </div>
            </Card>
          ))}

          {apps.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-black/5 shadow-xs">
              <p className="font-bold text-ink">No candidates in stage: {sp.stage || "all"}</p>
              {sp.stage && (
                <Button href={`/hr/jobs/${job._id}`} variant="secondary" className="mt-3 text-xs">
                  Clear stage filter
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right: STICKY FIXED JOB INFO & STAGE FILTER SIDEBAR */}
        <aside className="sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl bg-card p-6 card-float border border-black/5 space-y-6 shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Opening Details</span>
            <h3 className="font-bold text-base text-ink mt-0.5">{job.title}</h3>
            <p className="text-xs text-muted mt-1">
              {job.location} · {formatSalary(job.salaryMin, job.salaryMax)}
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-muted mb-2">Target Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {(job.skills || []).map((s: string) => (
                <span key={s} className="rounded-full bg-lime/40 px-2.5 py-0.5 text-xs font-bold text-ink capitalize">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Filter by Stage */}
          <div className="border-t border-black/5 pt-4">
            <div className="flex items-center justify-between mb-2.5">
              <p className="font-bold text-xs uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-ink" /> Filter by Stage
              </p>
              {sp.stage && (
                <Link href={`/hr/jobs/${job._id}`} className="text-[11px] font-bold text-coral underline">
                  Reset
                </Link>
              )}
            </div>

            <div className="space-y-1 text-xs">
              {stagesList.map((st) => {
                const active = (!sp.stage && st === "all") || sp.stage === st;
                const count = stageCounts[st] || 0;
                return (
                  <Link
                    key={st}
                    href={st === "all" ? `/hr/jobs/${job._id}` : `/hr/jobs/${job._id}?stage=${st}`}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 font-semibold transition-colors ${
                      active ? "bg-ink text-white" : "text-muted hover:bg-black/5 hover:text-ink"
                    }`}
                  >
                    <span className="capitalize">{st}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? "bg-white/20 text-white" : "bg-black/5 text-muted"}`}>
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
