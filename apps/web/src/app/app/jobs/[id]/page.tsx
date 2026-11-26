import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Resume } from "@/models/Resume";
import { Application } from "@/models/Application";
import { Badge, Card } from "@/components/ui";
import { formatSalary } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ApplyForm } from "./apply-form";

export default async function ApplyJobPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["CANDIDATE"]);
  const { id } = await params;
  await dbConnect();
  const job = await Job.findById(id).populate("companyId", "name");
  if (!job) notFound();
  const resume = await Resume.findOne({ userId: user.id }).sort({ createdAt: -1 });
  const existing = await Application.findOne({ jobId: job._id, candidateId: user.id });

  return (
    <div className="max-w-3xl">
      <Badge>{job.jobType}</Badge>
      <h1 className="mt-3 text-3xl font-extrabold">{job.title}</h1>
      <p className="text-muted">
        {job.companyId?.name} · {job.location} · {formatSalary(job.salaryMin, job.salaryMax)}
      </p>
      <Card className="mt-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{job.description}</p>
      </Card>
      {existing ? (
        <Card className="mt-6">
          You already applied. Stage: <strong>{existing.stage}</strong>
        </Card>
      ) : (
        <ApplyForm
          jobId={String(job._id)}
          resumeId={resume ? String(resume._id) : ""}
          questions={JSON.parse(JSON.stringify(job.screeningQuestions || []))}
        />
      )}
    </div>
  );
}
