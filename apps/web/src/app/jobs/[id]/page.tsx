import { MarketingNav } from "@/components/marketing-nav";
import { dbConnect } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Button, Badge, Card } from "@/components/ui";
import { formatSalary } from "@/lib/utils";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function PublicJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const job = await Job.findById(id).populate("companyId", "name logoText about location");
  if (!job) notFound();
  const session = await auth();
  const applyHref = session?.user?.role === "CANDIDATE" ? `/app/jobs/${id}` : "/register";

  return (
    <div>
      <MarketingNav />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Card>
          <Badge>{job.jobType}</Badge>
          <h1 className="mt-3 text-3xl font-extrabold">{job.title}</h1>
          <p className="mt-2 text-muted">
            {job.companyId?.name} · {job.location} · {formatSalary(job.salaryMin, job.salaryMax)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(job.skills || []).map((s: string) => (
              <Badge key={s} tone="lime">
                {s}
              </Badge>
            ))}
          </div>
          <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">{job.description}</p>
          <Button href={applyHref} className="mt-8">
            Apply now
          </Button>
        </Card>
      </div>
    </div>
  );
}
