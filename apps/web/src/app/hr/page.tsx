import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";
import { Card, Button, Badge } from "@/components/ui";
import { APPLICATION_STAGES } from "@autorecruit/shared";
import mongoose from "mongoose";

export default async function HrHome() {
  const user = await requireRole(["HR", "COMPANY_ADMIN"]);
  await dbConnect();
  const companyId = new mongoose.Types.ObjectId(user.companyId);
  const [jobs, apps] = await Promise.all([
    Job.countDocuments({ companyId }),
    Application.find({ companyId }).sort({ createdAt: -1 }).limit(8).populate("candidateId", "name").populate("jobId", "title").lean(),
  ]);
  const appsList = apps as any[];
  const staged = await Application.aggregate([
    { $match: { companyId } },
    { $group: { _id: "$stage", n: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(staged.map((s: any) => [s._id, s.n]));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-extrabold">
          Hiring workspace — AI ranks, <span className="lime-mark">you decide</span>
        </h1>
        <Button href="/hr/jobs/new" variant="lime">
          Post a job
        </Button>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-muted">Openings</p>
          <p className="text-3xl font-extrabold">{jobs}</p>
        </Card>
        {APPLICATION_STAGES.slice(0, 3).map((s) => (
          <Card key={s}>
            <p className="text-sm capitalize text-muted">{s}</p>
            <p className="text-3xl font-extrabold">{map[s] || 0}</p>
          </Card>
        ))}
      </div>
      <h2 className="mt-10 font-bold">Recent applicants</h2>
      <div className="mt-4 space-y-3">
        {appsList.map((a: any) => (
          <Card key={String(a._id)} className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{a.candidateId?.name}</p>
              <p className="text-sm text-muted">{a.jobId?.title}</p>
            </div>
            <Badge>{a.stage}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
