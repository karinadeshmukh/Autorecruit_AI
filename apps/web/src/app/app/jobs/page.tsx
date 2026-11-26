import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Company } from "@/models/Company";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui";
import Link from "next/link";
import { Filter, X, CheckCircle2, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CandidateJobs({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    jobType?: string;
    experienceLevel?: string;
    company?: string;
    remote?: string;
  }>;
}) {
  await requireRole(["CANDIDATE"]);
  const sp = await searchParams;
  await dbConnect();

  const filter: Record<string, unknown> = { status: "open" };
  if (sp.q) filter.title = { $regex: sp.q, $options: "i" };
  if (sp.jobType) filter.jobType = sp.jobType;
  if (sp.experienceLevel) filter.experienceLevel = sp.experienceLevel;
  if (sp.remote === "true") filter.remote = true;

  if (sp.company) {
    const comp = await Company.findOne({ slug: sp.company }).select("_id");
    if (comp) filter.companyId = comp._id;
  }

  const [jobs, companies] = (await Promise.all([
    Job.find(filter).populate("companyId", "name logoText logoUrl logoBg").sort({ createdAt: -1 }).lean(),
    Company.find().select("name slug").sort({ name: 1 }).lean(),
  ])) as [any[], any[]];

  const activeFiltersCount = [sp.q, sp.jobType, sp.experienceLevel, sp.company, sp.remote].filter(Boolean).length;

  function buildUrl(overrides: Record<string, string | undefined>) {
    const current: Record<string, string> = {};
    if (sp.q) current.q = sp.q;
    if (sp.jobType) current.jobType = sp.jobType;
    if (sp.experienceLevel) current.experienceLevel = sp.experienceLevel;
    if (sp.company) current.company = sp.company;
    if (sp.remote) current.remote = sp.remote;

    for (const [k, v] of Object.entries(overrides)) {
      if (v === undefined || v === "") {
        delete current[k];
      } else {
        current[k] = v;
      }
    }

    const qs = new URLSearchParams(current).toString();
    return `/app/jobs${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-ink">Browse open positions</h1>
        <p className="text-sm text-muted mt-1">
          Apply with your parsed resume to compute instant role compatibility scores.
        </p>
      </div>

      {/* Main Grid with Fixed Sticky Filter Sidebar */}
      <div className="grid gap-8 md:grid-cols-[260px_1fr] items-start">
        {/* STICKY FIXED FILTER SIDEBAR */}
        <aside className="sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl bg-card p-5 card-float border border-black/5 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-ink" />
              <h3 className="font-extrabold text-sm text-ink">Filters</h3>
            </div>
            {activeFiltersCount > 0 && (
              <Link
                href="/app/jobs"
                className="flex items-center gap-1 text-xs font-bold text-coral hover:underline"
              >
                <X className="h-3 w-3" /> Clear ({activeFiltersCount})
              </Link>
            )}
          </div>

          {/* Search Box inside filter sidebar */}
          <form action="/app/jobs" className="space-y-2">
            <div className="flex items-center gap-2 rounded-2xl bg-[#F6F3EC] px-3 py-2 border border-black/5">
              <Search className="h-3.5 w-3.5 text-muted" />
              <input
                suppressHydrationWarning
                name="q"
                defaultValue={sp.q}
                placeholder="Search keywords..."
                className="w-full text-xs outline-none bg-transparent font-medium"
              />
            </div>
          </form>

          {/* Remote Only */}
          <div>
            <Link
              href={buildUrl({ remote: sp.remote === "true" ? undefined : "true" })}
              className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                sp.remote === "true" ? "bg-lime text-ink" : "bg-black/5 text-muted hover:text-ink"
              }`}
            >
              <span>Remote only</span>
              {sp.remote === "true" && <CheckCircle2 className="h-3.5 w-3.5" />}
            </Link>
          </div>

          {/* Job Type */}
          <div>
            <p className="font-bold text-[11px] uppercase tracking-wider text-muted mb-2">Job Type</p>
            <div className="flex flex-wrap gap-1.5">
              {["Full-time", "Part-time", "Contract", "Internship"].map((t) => {
                const active = sp.jobType === t;
                return (
                  <Link
                    key={t}
                    href={buildUrl({ jobType: active ? undefined : t })}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                      active ? "bg-ink text-white" : "bg-black/5 text-muted hover:bg-black/10"
                    }`}
                  >
                    {t}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <p className="font-bold text-[11px] uppercase tracking-wider text-muted mb-2">Experience</p>
            <div className="flex flex-wrap gap-1.5">
              {["Entry", "Intermediate", "Expert"].map((t) => {
                const active = sp.experienceLevel === t;
                return (
                  <Link
                    key={t}
                    href={buildUrl({ experienceLevel: active ? undefined : t })}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                      active ? "bg-ink text-white" : "bg-black/5 text-muted hover:bg-black/10"
                    }`}
                  >
                    {t}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Company Filter List */}
          <div className="border-t border-black/5 pt-3">
            <p className="font-bold text-[11px] uppercase tracking-wider text-muted mb-2">Company</p>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1 text-xs">
              {companies.map((c: any) => {
                const active = sp.company === c.slug;
                return (
                  <Link
                    key={c.slug}
                    href={buildUrl({ company: active ? undefined : c.slug })}
                    className={`flex items-center justify-between rounded-lg px-2 py-1 font-medium transition-colors ${
                      active ? "bg-ink text-white font-bold" : "text-muted hover:bg-black/5 hover:text-ink"
                    }`}
                  >
                    <span>{c.name}</span>
                    {active && <CheckCircle2 className="h-3 w-3 text-lime" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Job Cards */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-muted bg-white border border-black/5 px-3 py-1 rounded-full">
              {jobs.length} open roles
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={String(job._id)} job={job} href={`/app/jobs/${job._id}`} />
            ))}

            {jobs.length === 0 && (
              <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-black/5">
                <p className="font-bold text-ink">No roles match the selected criteria.</p>
                <Button href="/app/jobs" variant="secondary" className="mt-3 text-xs">
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
