import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";
import { Card, Button, ScoreRing } from "@/components/ui";
import { JobCard } from "@/components/job-card";

export default async function CandidateHome() {
  const user = await requireRole(["CANDIDATE"]);
  await dbConnect();
  const [resume, apps, jobs] = await Promise.all([
    Resume.findOne({ userId: user.id }).sort({ createdAt: -1 }),
    Application.countDocuments({ candidateId: user.id }),
    Job.find({ status: "open" }).populate("companyId", "name logoText").sort({ createdAt: -1 }).limit(4).lean(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold">
        Hello {user.name?.split(" ")[0]}. Let’s find work that <span className="lime-mark">fits</span>.
      </h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-4">
          {resume ? <ScoreRing score={resume.qualityScore || 0} /> : <div className="h-14 w-14 rounded-full bg-lime" />}
          <div>
            <p className="text-sm text-muted">Resume quality</p>
            <p className="font-bold">{resume ? `${Math.round(resume.qualityScore || 0)} / 100` : "Upload a resume"}</p>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-muted">Applications</p>
          <p className="text-3xl font-extrabold">{apps}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Next step</p>
          <Button href="/app/resume" variant="lime" className="mt-2">
            Improve resume
          </Button>
        </Card>
      </div>
      <h2 className="mt-10 text-xl font-bold">Recommended jobs</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={String(job._id)} job={JSON.parse(JSON.stringify(job))} href={`/app/jobs/${job._id}`} />
        ))}
      </div>
    </div>
  );
}
