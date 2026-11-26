import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { Badge, Card, Button } from "@/components/ui";
import Link from "next/link";
import { Filter, Send, GraduationCap, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const user = await requireRole(["CANDIDATE"]);
  const sp = await searchParams;
  await dbConnect();

  const allApps = (await Application.find({ candidateId: user.id })
    .populate({ path: "jobId", populate: { path: "companyId", select: "name" } })
    .sort({ createdAt: -1 })
    .lean()) as any[];

  const apps = sp.stage && sp.stage !== "all"
    ? allApps.filter((a) => a.stage === sp.stage)
    : allApps;

  const stageCounts: Record<string, number> = {};
  for (const a of allApps) {
    stageCounts[a.stage] = (stageCounts[a.stage] || 0) + 1;
  }

  const STAGES = [
    { key: "all", label: "All Applications", count: allApps.length },
    { key: "applied", label: "Applied", count: stageCounts["applied"] || 0 },
    { key: "screened", label: "Screened", count: stageCounts["screened"] || 0 },
    { key: "assessment", label: "Assessment", count: stageCounts["assessment"] || 0 },
    { key: "shortlisted", label: "Shortlisted", count: stageCounts["shortlisted"] || 0 },
    { key: "interview", label: "Interview", count: stageCounts["interview"] || 0 },
    { key: "offer", label: "Offer", count: stageCounts["offer"] || 0 },
    { key: "hired", label: "Hired", count: stageCounts["hired"] || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-ink">My Applications</h1>
        <p className="mt-1 text-sm text-muted">
          Track real-time status across your active applications. AutoRecruit never auto-rejects candidates.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_260px] items-start">
        {/* Applications List */}
        <div className="space-y-3">
          {apps.map((a: any) => (
            <Card key={String(a._id)} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-bold text-base text-ink">{a.jobId?.title || "Role"}</p>
                <p className="text-xs text-muted mt-0.5">{a.jobId?.companyId?.name || "Company"}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted">
                  <span>Applied on {new Date(a.createdAt).toLocaleDateString()}</span>
                  {a.matchScore != null && (
                    <>
                      <span>•</span>
                      <span className="font-bold text-ink">Fit Score: {Math.round(a.matchScore)}%</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={a.stage === "rejected" ? "coral" : a.stage === "hired" ? "lime" : "ink"}>
                  {a.stage}
                </Badge>
                {a.jobId?.quizId && (
                  <Link
                    className="flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-xs font-bold text-ink hover:brightness-95 transition-all"
                    href={`/app/assessments/${a.jobId.quizId}?applicationId=${a._id}`}
                  >
                    <GraduationCap className="h-3.5 w-3.5" /> Take Quiz
                  </Link>
                )}
              </div>
            </Card>
          ))}

          {apps.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-black/5 shadow-xs">
              <Send className="h-10 w-10 text-muted mx-auto mb-2 opacity-50" />
              <p className="font-bold text-ink">No applications in this stage</p>
              <p className="text-xs text-muted mt-1">Explore open jobs and apply with your parsed resume.</p>
              <Button href="/app/jobs" variant="lime" className="mt-4 text-xs">
                Browse Jobs
              </Button>
            </div>
          )}
        </div>

        {/* STICKY FIXED STAGE FILTER SIDEBAR */}
        <aside className="sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl bg-card p-5 card-float border border-black/5 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-ink" />
              <h3 className="font-extrabold text-sm text-ink">Filter by Stage</h3>
            </div>
            {sp.stage && (
              <Link href="/app/applications" className="text-xs font-bold text-coral hover:underline">
                Clear
              </Link>
            )}
          </div>

          <div className="space-y-1">
            {STAGES.map((s) => {
              const active = (!sp.stage && s.key === "all") || sp.stage === s.key;
              return (
                <Link
                  key={s.key}
                  href={s.key === "all" ? "/app/applications" : `/app/applications?stage=${s.key}`}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    active ? "bg-ink text-white" : "bg-black/5 text-muted hover:text-ink"
                  }`}
                >
                  <span className="capitalize">{s.label}</span>
                  <span className="text-[11px] font-bold opacity-80">{s.count}</span>
                </Link>
              );
            })}
          </div>

          <div className="rounded-2xl border border-black/5 bg-[#F6F3EC]/50 p-3.5">
            <p className="text-xs font-bold text-ink flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-lime" /> Transparent Status
            </p>
            <p className="mt-1 text-[11px] text-muted">
              AutoRecruit provides honest funnel stage updates directly from hiring teams.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
