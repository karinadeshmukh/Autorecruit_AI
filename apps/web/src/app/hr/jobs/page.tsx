import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Button, Badge, Card } from "@/components/ui";
import Link from "next/link";
import mongoose from "mongoose";
import { Briefcase, Filter, Search, PlusCircle, Users, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HrJobs({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const user = await requireRole(["HR", "COMPANY_ADMIN"]);
  const sp = await searchParams;
  await dbConnect();

  const query: any = { companyId: new mongoose.Types.ObjectId(user.companyId) };
  if (sp.status && sp.status !== "all") {
    query.status = sp.status;
  }
  if (sp.q) {
    query.title = { $regex: sp.q, $options: "i" };
  }

  const allJobs = (await Job.find({ companyId: new mongoose.Types.ObjectId(user.companyId) }).lean()) as any[];
  const jobs = (await Job.find(query).sort({ createdAt: -1 }).lean()) as any[];

  const openCount = allJobs.filter((j) => j.status === "open").length;
  const closedCount = allJobs.filter((j) => j.status === "closed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Job Openings</h1>
          <p className="text-sm text-muted mt-1">
            Manage your company's roles and candidate evaluation pipelines.
          </p>
        </div>
        <Button href="/hr/jobs/new" variant="lime">
          <PlusCircle className="mr-1.5 h-4 w-4" /> New Opening
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px] items-start">
        {/* Main Jobs List */}
        <div className="space-y-3">
          {jobs.map((j: any) => (
            <Card key={String(j._id)} className="flex flex-wrap items-center justify-between gap-4 hover:border-black/20 transition-colors">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-base text-ink truncate">{j.title}</p>
                  <Badge tone={j.status === "open" ? "lime" : "muted"}>{j.status}</Badge>
                </div>
                <p className="text-xs text-muted mt-1">
                  {j.location} · {j.jobType} · {j.skills?.slice(0, 3).join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  className="flex items-center gap-1.5 text-xs font-bold bg-[#F6F3EC] px-3.5 py-2 rounded-full hover:bg-black/10 transition-colors"
                  href={`/hr/jobs/${j._id}`}
                >
                  <Users className="h-3.5 w-3.5" /> View Applicants
                </Link>
              </div>
            </Card>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-black/5 shadow-xs">
              <Briefcase className="h-10 w-10 text-muted mx-auto mb-2 opacity-50" />
              <p className="font-bold text-ink">No openings found</p>
              <p className="text-xs text-muted mt-1">Try clearing your filters or create a new opening.</p>
              {sp.status && (
                <Button href="/hr/jobs" variant="secondary" className="mt-3 text-xs">
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* STICKY FIXED FILTER SIDEBAR */}
        <aside className="sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl bg-card p-6 card-float border border-black/5 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-ink" />
              <h3 className="font-extrabold text-sm text-ink">Filter Openings</h3>
            </div>
            {(sp.status || sp.q) && (
              <Link href="/hr/jobs" className="text-xs font-bold text-coral hover:underline">
                Clear
              </Link>
            )}
          </div>

          {/* Search */}
          <form action="/hr/jobs">
            <div className="flex items-center gap-2 rounded-2xl bg-[#F6F3EC] px-3 py-2 border border-black/5">
              <Search className="h-3.5 w-3.5 text-muted" />
              <input
                suppressHydrationWarning
                name="q"
                defaultValue={sp.q}
                placeholder="Search titles..."
                className="w-full text-xs outline-none bg-transparent font-medium"
              />
            </div>
          </form>

          {/* Status Filters */}
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-muted mb-2.5">Status</p>
            <div className="space-y-1.5">
              <Link
                href="/hr/jobs"
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  !sp.status ? "bg-ink text-white" : "bg-black/5 text-muted hover:text-ink"
                }`}
              >
                <span>All Roles</span>
                <span className="text-[11px] font-bold opacity-80">{allJobs.length}</span>
              </Link>
              <Link
                href="/hr/jobs?status=open"
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  sp.status === "open" ? "bg-lime text-ink" : "bg-black/5 text-muted hover:text-ink"
                }`}
              >
                <span>Active / Open</span>
                <span className="text-[11px] font-bold opacity-80">{openCount}</span>
              </Link>
              <Link
                href="/hr/jobs?status=closed"
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  sp.status === "closed" ? "bg-ink text-white" : "bg-black/5 text-muted hover:text-ink"
                }`}
              >
                <span>Archived / Closed</span>
                <span className="text-[11px] font-bold opacity-80">{closedCount}</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl border border-black/5 bg-[#F6F3EC]/50 p-4">
            <p className="text-xs font-bold text-ink flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-lime" /> Pipeline Health
            </p>
            <p className="mt-1 text-xs text-muted">
              AutoRecruit calculates candidate match scores dynamically as applications arrive.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
