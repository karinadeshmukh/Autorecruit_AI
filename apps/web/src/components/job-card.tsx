import Link from "next/link";
import { Badge } from "./ui";
import { formatSalary } from "@/lib/utils";
import { Building2 } from "lucide-react";

type JobCardJob = {
  _id: string;
  title: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  createdAt?: string;
  companyId?: {
    name?: string;
    logoText?: string;
    logoUrl?: string;
    logoBg?: string;
  };
};

export function JobCard({ job, href }: { job: JobCardJob; href: string }) {
  const company = job.companyId;
  const logoBg = company?.logoBg || "#111111";

  return (
    <Link
      href={href}
      className="group relative block rounded-3xl border border-black/5 bg-card p-6 card-float transition-all duration-200 hover:-translate-y-1 hover:border-black/15"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {company?.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name || "Company"}
              className="h-12 w-12 rounded-2xl object-cover p-1.5 border border-black/5 shadow-sm"
              style={{ backgroundColor: logoBg }}
            />
          ) : (
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl text-sm font-extrabold text-white shadow-sm"
              style={{ backgroundColor: logoBg }}
            >
              {company?.logoText || company?.name?.slice(0, 2) || "AR"}
            </span>
          )}
          <div>
            <h3 className="font-bold text-ink text-base group-hover:text-black">
              {job.title}
            </h3>
            <p className="text-sm text-muted flex items-center gap-1.5 mt-0.5">
              <span className="font-medium text-ink/80">{company?.name || "Company"}</span>
              <span>•</span>
              <span>{job.location || "Remote"}</span>
            </p>
          </div>
        </div>
        <span className="text-xs text-muted font-medium shrink-0">
          {job.createdAt ? new Date(job.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {job.jobType && <Badge>{job.jobType}</Badge>}
        {job.experienceLevel && <Badge tone="yellow">{job.experienceLevel}</Badge>}
        {job.remote && <Badge tone="lime">Remote</Badge>}
        {(job.skills || []).slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-muted capitalize"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3.5">
        <p className="font-bold text-ink text-sm">
          {formatSalary(job.salaryMin, job.salaryMax)}
        </p>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-ink group-hover:translate-x-0.5 transition-transform">
          View opening →
        </span>
      </div>
    </Link>
  );
}
