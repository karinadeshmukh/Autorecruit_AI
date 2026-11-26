import { MarketingNav } from "@/components/marketing-nav";
import { JobCard } from "@/components/job-card";
import { dbConnect } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Company } from "@/models/Company";
import { Button } from "@/components/ui";
import Link from "next/link";
import { Filter, X, Building2, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PublicJobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    location?: string;
    jobType?: string;
    experienceLevel?: string;
    company?: string;
    remote?: string;
  }>;
}) {
  const sp = await searchParams;
  await dbConnect();

  const filter: Record<string, unknown> = { status: "open" };
  if (sp.q) filter.title = { $regex: sp.q, $options: "i" };
  if (sp.location) filter.location = { $regex: sp.location, $options: "i" };
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

  const activeFiltersCount = [sp.q, sp.location, sp.jobType, sp.experienceLevel, sp.company, sp.remote].filter(Boolean).length;

  function buildUrl(overrides: Record<string, string | undefined>) {
    const current: Record<string, string> = {};
    if (sp.q) current.q = sp.q;
    if (sp.location) current.location = sp.location;
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
    return `/jobs${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="min-h-screen bg-[#F6F3EC]">
      {/* Header Search Banner */}
      <div className="bg-ink text-white">
        <MarketingNav dark />
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-lime mb-2">Verified Roles</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Explore verified tech openings</h1>
          <p className="text-white/70 text-sm mt-2 max-w-lg">
            Apply directly with your AutoRecruit profile and receive instant, transparent ATS compatibility scoring.
          </p>

          <form action="/jobs" className="mt-8 flex flex-wrap gap-2 rounded-full bg-white p-2 text-ink shadow-lg max-w-2xl">
            <input
              suppressHydrationWarning
              name="q"
              defaultValue={sp.q}
              placeholder="Job title or technology (e.g. Next.js, Python, Design)"
              className="flex-1 rounded-full px-5 py-2.5 text-sm outline-none font-medium bg-transparent"
            />
            <input
              suppressHydrationWarning
              name="location"
              defaultValue={sp.location}
              placeholder="Location or Remote"
              className="w-44 rounded-full px-4 py-2.5 text-sm outline-none font-medium bg-transparent"
            />
            <Button type="submit" variant="lime" className="!px-6">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Main Grid with Fixed Sticky Filter Sidebar */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[280px_1fr] items-start">
        {/* STICKY FIXED FILTER SIDEBAR */}
        <aside className="sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl bg-card p-6 card-float border border-black/5 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-ink" />
              <h3 className="font-extrabold text-sm text-ink">Filters</h3>
            </div>
            {activeFiltersCount > 0 && (
              <Link
                href="/jobs"
                className="flex items-center gap-1 text-xs font-bold text-coral hover:underline"
              >
                <X className="h-3 w-3" /> Clear ({activeFiltersCount})
              </Link>
            )}
          </div>

          {/* Remote Toggle */}
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-muted mb-2.5">Workplace</p>
            <Link
              href={buildUrl({ remote: sp.remote === "true" ? undefined : "true" })}
              className={`flex items-center justify-between rounded-2xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                sp.remote === "true" ? "bg-lime text-ink" : "bg-black/5 text-muted hover:text-ink"
              }`}
            >
              <span>Remote roles only</span>
              {sp.remote === "true" && <CheckCircle2 className="h-3.5 w-3.5" />}
            </Link>
          </div>

          {/* Job Type Pills */}
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-muted mb-2.5">Job Type</p>
            <div className="flex flex-wrap gap-1.5">
              {["Full-time", "Part-time", "Internship", "Contract"].map((t) => {
                const active = sp.jobType === t;
                return (
                  <Link
                    key={t}
                    href={buildUrl({ jobType: active ? undefined : t })}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      active ? "bg-ink text-white shadow-xs" : "bg-black/5 text-muted hover:bg-black/10 hover:text-ink"
                    }`}
                  >
                    {t}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Experience Level Pills */}
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-muted mb-2.5">Experience Level</p>
            <div className="flex flex-wrap gap-1.5">
              {["Entry", "Intermediate", "Expert"].map((t) => {
                const active = sp.experienceLevel === t;
                return (
                  <Link
                    key={t}
                    href={buildUrl({ experienceLevel: active ? undefined : t })}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      active ? "bg-ink text-white shadow-xs" : "bg-black/5 text-muted hover:bg-black/10 hover:text-ink"
                    }`}
                  >
                    {t}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Company Filter List */}
          <div className="border-t border-black/5 pt-4">
            <p className="font-bold text-xs uppercase tracking-wider text-muted mb-2.5">Hiring Company</p>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
              {companies.map((c: any) => {
                const active = sp.company === c.slug;
                return (
                  <Link
                    key={c.slug}
                    href={buildUrl({ company: active ? undefined : c.slug })}
                    className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 font-medium transition-colors ${
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

        {/* Right Job Cards Grid */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-ink">Available Positions</h2>
            <span className="text-xs font-bold bg-black/5 px-3 py-1 rounded-full text-muted">
              {jobs.length} roles found
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={String(job._id)} job={job} href={`/jobs/${job._id}`} />
            ))}

            {jobs.length === 0 && (
              <div className="col-span-2 text-center py-16 bg-white rounded-3xl border border-black/5 shadow-xs">
                <p className="font-bold text-ink text-lg">No openings matched your filters.</p>
                <p className="text-sm text-muted mt-1">Try clearing some filters or searching broader keywords.</p>
                <Button href="/jobs" variant="secondary" className="mt-4">
                  Reset all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
